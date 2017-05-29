using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Script.Serialization;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using BLL;

namespace BLLTests
{
    [TestClass]
    public class UnitTest1
    {
        private  readonly List<DriveInfo> driveList = new List<DriveInfo>();
        private  List<DirectoryInfo> dirsList = new List<DirectoryInfo>();
        private  List<FileInfo> filesList = new List<FileInfo>();
        private DriveInfo selectedDriveInfo;

        [TestInitialize]
        public void Init()
        {

            foreach (var drives in DriveInfo.GetDrives())
                driveList.Add(drives);

            selectedDriveInfo = driveList.FirstOrDefault();

        }
        [TestMethod]
        public void ShouldGiveDrives()
        {
            BLL.BLL b = new BLL.BLL();
            string s = b.GetDirectory();
            Console.WriteLine(s);
            var disks = new List<string>();
            foreach (var drives in driveList)
                disks.Add(drives.ToString());
            var str = String.Empty;
            foreach (var disk in disks)
            {
                str += disk;
            }
           Assert.AreEqual(str,s);
        }

        [TestMethod]
        public void ShouldGetDirectoriesFromFolderofDisk()
        {
            string path = Path.GetFullPath(selectedDriveInfo.Name);
            DirectoryInfo d = new DirectoryInfo(path);
            Console.WriteLine($"parent: {d.Parent?.Name ?? "nope"}");
            Console.WriteLine(d);
            Console.WriteLine(path);

            var directoryInfos = selectedDriveInfo?.RootDirectory.GetDirectories();
            if (directoryInfos == null) throw new Exception("Can't find Root");
            foreach (var dir in directoryInfos)
                dirsList.Add(dir);

            var list = new List<string>();
            dirsList.ForEach(x=>list.Add(x.Name));

            var json = new JavaScriptSerializer().Serialize(list);
            Console.WriteLine(json);

            var str = String.Empty;
            foreach (var directori in directoryInfos)
            {
                Console.WriteLine();
                str += directori.Name;
            }

            Console.WriteLine(str);
        }

    }
}
