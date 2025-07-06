using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using R7L.Services.Resource;
using Microsoft.Extensions.Configuration;

[ApiController]
[Route("api/resource")]
public class ResourceController : ControllerBase
{
    private readonly string _resourceRoot = "/resources";
    private readonly ResourceProcessingService _resourceProcessingService;
    private readonly IConfiguration _config;

    public ResourceController(ResourceProcessingService resourceProcessingService, IConfiguration config)
    {
        _resourceProcessingService = resourceProcessingService;
        _config = config;
    }
    [HttpGet("public/{*path}")]
    [AllowAnonymous]
    public IActionResult GetPublicImage(string path)
    {
        var filePath = Path.Combine(_resourceRoot, path);
        if (!System.IO.File.Exists(filePath))
            return NotFound();

        var ext = Path.GetExtension(filePath).ToLowerInvariant();
        var contentType = ext switch
        {
            ".png" => "image/png",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".gif" => "image/gif",
            ".svg" => "image/svg+xml",
            _ => "application/octet-stream"
        };
        return PhysicalFile(filePath, contentType, Path.GetFileName(filePath));
    }

    [HttpGet("list/{*path}")]
    public IActionResult ListFiles(string path)
    {
        var dirPath = Path.Combine(_resourceRoot, path ?? "");
        if (!Directory.Exists(dirPath))
            return NotFound();
        var files = Directory.GetFiles(dirPath)
            .Select(f => Path.GetFileName(f))
            .ToArray();
        return Ok(files);
    }

    [HttpGet("internal/{*path}")]
    public IActionResult GetInternalResource(string path)
    {
        var remoteIp = HttpContext.Connection.RemoteIpAddress;
        if (!remoteIp.ToString().StartsWith("172."))
            return Unauthorized();

        var filePath = Path.Combine(_resourceRoot, path);
        if (!System.IO.File.Exists(filePath))
            return NotFound();

        var contentType = "application/octet-stream";
        return PhysicalFile(filePath, contentType, Path.GetFileName(filePath));
    }

    [Authorize]
    [HttpGet("{*path}")]
    public IActionResult GetResource(string path)
    {
        var filePath = Path.Combine(_resourceRoot, path);
        if (!System.IO.File.Exists(filePath))
            return NotFound();

        var contentType = "application/octet-stream";
        return PhysicalFile(filePath, contentType, Path.GetFileName(filePath));
    }

    [Authorize]
    [HttpPost("upload")]
    public async Task<IActionResult> UploadResource([FromForm] IFormFile file, [FromForm] string subdir, [FromForm] int? courseId, [FromForm] int? orderInCourse, [FromForm] string name)
    {
        string fileName = !string.IsNullOrWhiteSpace(name) ? name + Path.GetExtension(file.FileName) : file.FileName;
        string savePath;
        string returnPath;
        if ((subdir ?? "").ToLower() == "exercise_desc")
        {
            var tempDir = Path.Combine(_resourceRoot, "temp_exercise_desc");
            Directory.CreateDirectory(tempDir);
            fileName = name + "_temp" + Path.GetExtension(file.FileName);
            savePath = Path.Combine(tempDir, fileName);
            returnPath = $"temp_exercise_desc/{fileName}";
        }
        else
        {
            var saveDir = Path.Combine(_resourceRoot, subdir ?? "");
            Directory.CreateDirectory(saveDir);
            savePath = Path.Combine(saveDir, fileName);
            returnPath = $"{subdir}/{fileName}";
        }

        using (var stream = new FileStream(savePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var ok = await _resourceProcessingService.ProcessResourceAsync(subdir, savePath, courseId, orderInCourse, name);
        if (!ok)
            return StatusCode(500, new { error = "Ошибка обработки ресурса микросервисом" });

        return Ok(new { path = returnPath });
    }
    [Authorize(Roles = "student")]
    [HttpPost("upload/temp_exercise")]
    public async Task<IActionResult> UploadTempExercise([FromForm] IFormFile file, [FromForm] string userId)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "Файл не выбран" });

        if (string.IsNullOrWhiteSpace(userId))
            userId = "unknown";

        var saveDir = Path.Combine(_resourceRoot, "temp_exercise");
        Directory.CreateDirectory(saveDir);
        var ext = Path.GetExtension(file.FileName);
        var fileName = $"user_{userId}_{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}{ext}";
        var savePath = Path.Combine(saveDir, fileName);

        using (var stream = new FileStream(savePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Ok(new { path = $"temp_exercise/{fileName}" });
    }
}