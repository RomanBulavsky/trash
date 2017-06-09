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

        //TODO: ERROR DI!!!

        public FileSystemProvider FileSystemProvider { get; } = new FileSystemProvider();

        public HomeController(IFileSystemFrame fileSystemFrame)
        {
            //var x = HostingEnvironment.MapPath("~/xxx");
            FileSystemFrame = fileSystemFrame;
            Console.WriteLine("CTOR");
        }

        public JsonResult GetDirectory(string path)
        {
            //var z = path;
            //var xxxx = FileSystemProvider.GetDirectories("C:/");

            FileSystemFrame.FillInFileSystemFrame(path);
            var temp = new {
                Files = FileSystemFrame.Files.Select(x => x.Name),
                Folders = FileSystemFrame.Directories.Select(x => x.Name)
            };

            return Json(temp, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetFiles(string path)
        {

            FileSystemFrame.FillInFileSystemFrame(path);

            var temp = FileSystemFrame.Files.Select(x => new X() {name = x.Name});
          

            return Json(temp, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetFile(string path)
        {

            FileSystemFrame.FillInFileSystemFrame(path);

            var temp = FileSystemFrame.Files.Select(x => new { file = x.Name });


            return Json(temp, JsonRequestBehavior.AllowGet);
        }

        public class XXX
        {
            public string X {get;set;}
        }

        public JsonResult DeleteFile(string path)
        {

            //FileSystemFrame.FillInFileSystemFrame(path);

            FileSystemProvider.DeleteFile(path);
            //var temp = FileSystemFrame.Files.Select(x => new { file = x.Name });

            return Json( true, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        public JsonResult ChangeFileName(string path, string oldName, string newName)
        {

            //FileSystemFrame.FillInFileSystemFrame(path);
            FileSystemProvider.UpdateFileName(path,oldName,newName);
            //var temp = FileSystemFrame.Files.Select(x => new { file = x.Name });

            return Json(true, JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddFile(string path, string name)
        {

            //FileSystemFrame.FillInFileSystemFrame(path);
            FileSystemProvider.CreateFile(path, name);
            //var temp = FileSystemFrame.Files.Select(x => new { file = x.Name });


            return Json(path + name , JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetBreadCrumbs(string path)
        {
            var pathx = Path.GetFullPath(path);
            var pathParts = pathx.Split(new[] { Path.DirectorySeparatorChar },StringSplitOptions.RemoveEmptyEntries);
            var paths = new List<string>(12);
            for (var i = 0; i < pathParts.Length; i++)
            {
                //if (i == 0) paths.Add(a[i] + "\\");
                for (var j = 0; j < i + 1; j++)
                    if (j == 0) paths.Add(pathParts[j] + Path.DirectorySeparatorChar);
                    else
                        paths[i] += pathParts[j] + Path.DirectorySeparatorChar;
            }
            return Json(paths, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetParrent(string path)
        {
            var x = Directory.GetParent(Path.GetFullPath(path));
           
            return Json(x.FullName, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetFolder(string path)
        {

            FileSystemFrame.FillInFileSystemFrame(path);

            var temp = FileSystemFrame.Directories.Select(x => new { folder = x.Name, path = x.FullName });


            return Json(temp, JsonRequestBehavior.AllowGet);
        }

        class X
        {
            public string name { get; set; }
        }

        public JsonResult set(string name)
        {
            //FileSystemProvider.UpdateFileName("C:/home",);
            return Json(name, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Disk()
        {
            string[] smass = new[] {"C:/", "D:/"};
           //return Json(new {Drive = FileSystemProvider.GetDrives().Select(x => x.Name) }, JsonRequestBehavior.AllowGet);
            return Json(new {Drives = smass}, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDrives()
        {

            var temp = FileSystemFrame.Drives.Select(x => new { drive = x.Name });

            DriveViewModel[] smass = { new DriveViewModel { drive = "C:/"}, new DriveViewModel { drive = "D:/" } };
            //return Json(new {Drive = FileSystemProvider.GetDrives().Select(x => x.Name) }, JsonRequestBehavior.AllowGet);
            return Json(smass, JsonRequestBehavior.AllowGet);
        }

        class DriveViewModel
        {
            public string drive { get; set; }
        }

        public JsonResult Index2()
        {
            ViewBag.Drives = FileSystemFrame.Drives.Select(x=>x.Name).ToList();
            FileSystemFrame.FillInFileSystemFrame("c:/Home");
            RepresentingClass r = new RepresentingClass()
            {
                Drives = FileSystemFrame.Drives.Select(x=>x.Name),
                Files = FileSystemFrame.Files.Select(x => x.Name),
                Folders = FileSystemFrame.Directories.Select(x => x.Name)
            };

            return Json(r, JsonRequestBehavior.AllowGet);
            //return View();
        }

        public ViewResult Index()
        {
            return View();
        }

        [Authorize]
        public JsonResult AuthTest()
        {
            string s = "Authorized!";
            return Json(s,JsonRequestBehavior.AllowGet);
          
        }

        class RepresentingClass
        {
            public IEnumerable<string> Drives { get; set; }
            public IEnumerable<string> Files { get; set; }
            public IEnumerable<string> Folders { get; set; }
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