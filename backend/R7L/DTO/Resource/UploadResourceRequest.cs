using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace R7L.DTO.Resource
{
    public class UploadResourceRequest
    {
        [FromForm(Name = "file")]
        public IFormFile File { get; set; }

        [FromForm(Name = "subdir")]
        public string Subdir { get; set; }

        [FromForm(Name = "courseId")]
        public int? CourseId { get; set; }

        [FromForm(Name = "orderInCourse")]
        public int? OrderInCourse { get; set; }

        [FromForm(Name = "name")]
        public string Name { get; set; }
    }
}
