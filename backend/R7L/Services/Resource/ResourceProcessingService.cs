namespace R7L.Services.Resource
{
    public class ResourceProcessingService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<ResourceProcessingService> _logger;
        private readonly IConfiguration _config;

        public ResourceProcessingService(HttpClient httpClient, ILogger<ResourceProcessingService> logger, IConfiguration config)
        {
            _httpClient = httpClient;
            _logger = logger;
            _config = config;
        }

        public async Task<bool> ProcessResourceAsync(string subdir, string filePath, int? courseId = null, int? orderInCourse = null, string name = null)
        {
            try
            {
                _logger.LogInformation($"ProcessResourceAsync: subdir={subdir}, filePath={filePath}, courseId={courseId}, orderInCourse={orderInCourse}, name={name}");

                int validCourseId = (courseId.HasValue && courseId.Value > 0) ? courseId.Value : 1;
                int validOrderInCourse = (orderInCourse.HasValue && orderInCourse.Value > 0) ? orderInCourse.Value : 1;

                if (string.IsNullOrWhiteSpace(filePath) || !System.IO.File.Exists(filePath))
                {
                    _logger.LogError($"File not found or path is empty: {filePath}");
                    return false;
                }

                switch (subdir)
                {
                    case "docx":
                        {
                            // Converter: convertDocx
                            var url = _config["Services:ConverterUrl"] + "/convertDocx";
                            using var form = new MultipartFormDataContent();
                            form.Add(new StreamContent(System.IO.File.OpenRead(filePath)), "docx", System.IO.Path.GetFileName(filePath));
                            form.Add(new StringContent(validCourseId.ToString()), "courseId");
                            form.Add(new StringContent(validOrderInCourse.ToString()), "orderInCourse");
                            string validName = !string.IsNullOrWhiteSpace(name) ? name : System.IO.Path.GetFileNameWithoutExtension(filePath);
                            form.Add(new StringContent(validName), "name");
                            _logger.LogInformation($"POST {url} file={filePath} courseId={validCourseId} orderInCourse={validOrderInCourse} name={validName}");
                            var resp = await _httpClient.PostAsync(url, form);
                            var respContent = await resp.Content.ReadAsStringAsync();
                            _logger.LogInformation($"Response: {resp.StatusCode} {respContent}");
                            return resp.IsSuccessStatusCode;
                        }
                    case "unit":
                    case "lesson":
                    case "exercise":
                        {
                            // Converter: CreateLesson or CreateExercise
                            string validName = !string.IsNullOrWhiteSpace(name) ? name : System.IO.Path.GetFileNameWithoutExtension(filePath);
                            if (string.IsNullOrWhiteSpace(validName))
                            {
                                _logger.LogError($"Parameter 'name' is required for {subdir} and could not be determined.");
                                return false;
                            }
                            var url = _config["Services:ConverterUrl"] + "/CreateLesson";
                            if (subdir == "exercise")
                                url = _config["Services:ConverterUrl"] + "/CreateExercise";
                            using var form = new MultipartFormDataContent();
                            form.Add(new StreamContent(System.IO.File.OpenRead(filePath)), "docx", System.IO.Path.GetFileName(filePath));
                            form.Add(new StringContent(validName), "name");
                            form.Add(new StringContent(validCourseId.ToString()), "courseId");
                            form.Add(new StringContent(validOrderInCourse.ToString()), "orderInCourse");
                            _logger.LogInformation($"POST {url} file={filePath} name={validName} courseId={validCourseId} orderInCourse={validOrderInCourse}");
                            var resp = await _httpClient.PostAsync(url, form);
                            var respContent = await resp.Content.ReadAsStringAsync();
                            _logger.LogInformation($"Response: {resp.StatusCode} {respContent}");
                            return resp.IsSuccessStatusCode;
                        }
                    case "Tests":
                        {
                            // TestCreator: CreateNewTest
                            var url = _config["Services:TestCreatorUrl"] + "/CreateNewTest";
                            string validName = !string.IsNullOrWhiteSpace(name) ? name : System.IO.Path.GetFileNameWithoutExtension(filePath);
                            var body = new
                            {
                                courseId = validCourseId,
                                orderInCourse = validOrderInCourse,
                                testInfoPath = filePath,
                                name = validName
                            };
                            _logger.LogInformation($"POST {url} body={{courseId={validCourseId}, orderInCourse={validOrderInCourse}, testInfoPath={filePath}, name={validName}}}");
                            var resp = await _httpClient.PostAsJsonAsync(url, body);
                            var respContent = await resp.Content.ReadAsStringAsync();
                            _logger.LogInformation($"Response: {resp.StatusCode} {respContent}");
                            return resp.IsSuccessStatusCode;
                        }
                    case "exercise_desc":
                        {
                            // Converter: CreateExerciseInfo
                            string validName = !string.IsNullOrWhiteSpace(name) ? name : System.IO.Path.GetFileNameWithoutExtension(filePath);
                            if (string.IsNullOrWhiteSpace(validName))
                            {
                                _logger.LogError("Parameter 'name' is required for exercise_desc and could not be determined.");
                                return false;
                            }
                            var url = _config["Services:ConverterUrl"] + "/CreateExerciseInfo";
                            using var form = new MultipartFormDataContent();
                            form.Add(new StreamContent(System.IO.File.OpenRead(filePath)), "descDocx", System.IO.Path.GetFileName(filePath));
                            form.Add(new StringContent(validName), "name");
                            form.Add(new StringContent(validCourseId.ToString()), "courseId");
                            form.Add(new StringContent(validOrderInCourse.ToString()), "orderInCourse");
                            _logger.LogInformation($"POST {url} file={filePath} name={validName} courseId={validCourseId} orderInCourse={validOrderInCourse}");
                            var resp = await _httpClient.PostAsync(url, form);
                            var respContent = await resp.Content.ReadAsStringAsync();
                            _logger.LogInformation($"Response: {resp.StatusCode} {respContent}");
                            return resp.IsSuccessStatusCode;
                        }
                    case "exercises":
                        {
                            // ExerciseCheck: CreateNewExercise
                            string validName = !string.IsNullOrWhiteSpace(name) ? name : System.IO.Path.GetFileNameWithoutExtension(filePath);
                            if (string.IsNullOrWhiteSpace(validName))
                            {
                                _logger.LogError("Parameter 'name' is required for exercises and could not be determined.");
                                return false;
                            }
                            var url = _config["Services:ExerciseCheckUrl"] + "/CreateNewExercise";
                            var body = new
                            {
                                courseId = validCourseId,
                                orderInCourse = validOrderInCourse,
                                name = validName,
                                expectedSolutionPath = filePath
                            };
                            _logger.LogInformation($"POST {url} body={{courseId={validCourseId}, orderInCourse={validOrderInCourse}, name={validName}, expectedSolutionPath={filePath}}}");
                            var resp = await _httpClient.PostAsJsonAsync(url, body);
                            var respContent = await resp.Content.ReadAsStringAsync();
                            _logger.LogInformation($"Response: {resp.StatusCode} {respContent}");
                            return resp.IsSuccessStatusCode;
                        }
                    default:
                        _logger.LogWarning($"Unknown resource subdir: {subdir}");
                        return false;
                }
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, $"Ошибка при обработке ресурса: {ex.Message}");
                return false;
            }
        }
    }
}
