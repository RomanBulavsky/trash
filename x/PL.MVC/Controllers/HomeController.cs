using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using Bll;
using Bll.Interfaces;

namespace PL.MVC.Controllers
{
    public class HomeController : Controller
    {
        public IFileSystemFrame FileSystemFrame { get; }
        
        public IFileSystemProvider FileSystemProvider { get; }

        public HomeController(IFileSystemFrame fileSystemFrame, IFileSystemProvider fileSystemProvider)
        {
            FileSystemFrame = fileSystemFrame;
            FileSystemProvider = fileSystemProvider;
        }

        public JsonResult GetDirectory(string path)
        {
            FileSystemFrame.FillInFileSystemFrame(path);
            var temp = new {
                Files = FileSystemFrame.Files.Select(x => x.Name),
                Folders = FileSystemFrame.Folders.Select(x => x.Name)
            };

            return Json(temp, JsonRequestBehavior.AllowGet);
        }
 
        public JsonResult GetFiles(string path)
        {

            FileSystemFrame.FillInFileSystemFrame(path);

            var temp = FileSystemFrame.Files.Select(x => new {name = x.Name});
          

            return Json(temp, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetFile(string path)
        {

            FileSystemFrame.FillInFileSystemFrame(path);

            var temp = FileSystemFrame.Files.Select(x => new { file = x.Name });


            return Json(temp, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        public JsonResult DeleteFile(string path)
        {
            FileSystemProvider.DeleteFile(path);

            return Json( true, JsonRequestBehavior.AllowGet);
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete]
        public JsonResult DeleteFolder(string path)
        {
            FileSystemProvider.DeleteFolder(path);
            return Json(true, JsonRequestBehavior.AllowGet);
        }
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public JsonResult ChangeFolderName(string path, string oldName, string newName)
        {
            try
            {
                FileSystemProvider.UpdateFolderName(path, oldName, newName);
                return Json(true, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(false, JsonRequestBehavior.AllowGet);
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public JsonResult ChangeFileName(string path, string oldName, string newName)
        {

            try
            {
                FileSystemProvider.UpdateFileName(path, oldName, newName);

                return Json(true, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(false, JsonRequestBehavior.AllowGet);
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public JsonResult AddFile(string path, string name)
        {
            FileSystemProvider.CreateFile(path, name);

            return Json(path + name , JsonRequestBehavior.AllowGet);
        }
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public JsonResult AddFolder(string path, string name)
        {
            FileSystemProvider.CreateFolder(path, name);

            return Json(path + name, JsonRequestBehavior.AllowGet);
        }
        [Authorize]
        [HttpGet]
        public JsonResult GetBreadCrumbs(string path)
        {
            var pathx = Path.GetFullPath(path);//TODO: change to linq
            var pathParts = pathx.Split(new[] { Path.DirectorySeparatorChar },StringSplitOptions.RemoveEmptyEntries);
            var paths = new List<string>(12);
            for (var i = 0; i < pathParts.Length; i++)
            {
                for (var j = 0; j < i + 1; j++)
                    if (j == 0) paths.Add(pathParts[j] + Path.DirectorySeparatorChar);
                    else
                        paths[i] += pathParts[j] + Path.DirectorySeparatorChar;
            }
            return Json(paths, JsonRequestBehavior.AllowGet);
        }
        [Authorize]
        [HttpGet]
        public JsonResult GetParrent(string path)
        {
            var x = Directory.GetParent(Path.GetFullPath(path));
           
            return Json(x.FullName, JsonRequestBehavior.AllowGet);
        }
        [Authorize]
        [HttpGet]
        public JsonResult GetFolder(string path)
        {

            FileSystemFrame.FillInFileSystemFrame(path);

            var temp = FileSystemFrame.Folders.Select(x => new { folder = x.Name, path = x.FullName });


            return Json(temp, JsonRequestBehavior.AllowGet);
        }
        [Authorize]
        [HttpGet]
        public JsonResult GetDrives()=>
            Json(FileSystemProvider.GetDrives().Select(x => new {drive= x.Name } ), JsonRequestBehavior.AllowGet);

        public ActionResult Index()
        {
            return File("main.html","text/html");
        }


        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}