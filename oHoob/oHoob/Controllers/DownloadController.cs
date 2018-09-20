using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace oHoob.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DownloadController : ControllerBase
    {
        private IHostingEnvironment _hostingEnvironment;

        public DownloadController(IHostingEnvironment environment)
        {
            _hostingEnvironment = environment;
        }

        [HttpGet("{fileName}")]//http get as it return file 
        public HttpResponseMessage GetTestFile([FromRoute] string fileName)
        {
            //below code locate physcial file on server 
            var localFilePath = Path.Combine(_hostingEnvironment.WebRootPath, "product/abc.jpg");
            HttpResponseMessage response = null;
            //if file present than read file 
            var fStream = new FileStream(localFilePath, FileMode.Open, FileAccess.Read);
            //compose response and include file as content in it
            response = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StreamContent(fStream)
            };
            //set content header of reponse as file attached in reponse
            response.Content.Headers.ContentDisposition =
            new ContentDispositionHeaderValue("attachment")
            {
                FileName = Path.GetFileName(fStream.Name)
            };
            //set the content header content type as application/octet-stream as it returning file as reponse 
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            return response;
        }
    }
}