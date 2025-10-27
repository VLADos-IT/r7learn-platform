using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace R7L.DTO.Resource
{
    public class UploadTempExerciseRequest
    {
        [FromForm(Name = "file")]
        public IFormFile File { get; set; }

        [FromForm(Name = "userId")]
        public string UserId { get; set; }
    }
}
