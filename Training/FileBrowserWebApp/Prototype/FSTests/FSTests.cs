using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using FS;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace FSTests
{
    class DriveInfoComparer:IComparer<IEnumerable<DriveInfo>>, IComparer
    {
        
        public int Compare(IEnumerable<DriveInfo> x, IEnumerable<DriveInfo> y)
        {
            var xA = x.ToArray();
            var yA = y.ToArray();
            if (xA.Length != yA.Length)
            {
                return xA.Length - yA.Length;
            }

            for (int i = 0; i < xA.Length; i++)
            {
                if (xA[i].GetHashCode() != yA[i].GetHashCode())
                {
                    return -1;
                }
            }
            return 0;
        }

        public int Compare(object x, object y)
        {
            return Compare((IEnumerable)x, (IEnumerable)y);
        }
    }
    [TestClass]
    public class FSTests
    {
        private readonly List<DriveInfo> driveList = new List<DriveInfo>();
        private List<DirectoryInfo> dirsList = new List<DirectoryInfo>();
        private List<FileInfo> filesList = new List<FileInfo>();
        private DriveInfo selectedDriveInfo;
        string path = String.Empty;
        Browser browser;

        [TestInitialize]
        public void Init()
        {
            foreach (var drives in DriveInfo.GetDrives())
                driveList.Add(drives);

            selectedDriveInfo = driveList.FirstOrDefault();
            path = selectedDriveInfo.Name;
            browser = new Browser(path);

        }
        [TestMethod]
        public void ShouldGiveDrives()
        {
            var actual = browser.GetDrives();
            var actualStrings = actual.ToList().Select(x => x.ToString()).ToList();
            var expected =  DriveInfo.GetDrives();
            var expectedStrings = expected.ToList().Select(x => x.ToString()).ToList();
            
            CollectionAssert.AreEqual(actualStrings, expectedStrings);
        }
        
        [TestMethod]
        public void ShouldGiveDirs()
        {
            var actual = browser.GetDirectories(path);
            var actualStrings = actual.ToList().Select(x => x.ToString()).ToList();
            var expected = new DirectoryInfo(path).GetDirectories();
            var expectedStrings = expected.ToList().Select(x => x.ToString()).ToList();
            expectedStrings.ForEach(Console.WriteLine);
            Console.WriteLine("============");
            actualStrings.ForEach(Console.WriteLine);
            CollectionAssert.AreEqual(actualStrings, expectedStrings);
        }
        [TestMethod]
        public void ShouldGiveFiles()
        {
            var actual = browser.GetFiles(path);
            var actualStrings = actual.ToList().Select(x => x.ToString()).ToList();
            var expected = new DirectoryInfo(path).GetFiles();
            var expectedStrings = expected.ToList().Select(x => x.ToString()).ToList();
            expectedStrings.ForEach(Console.WriteLine);
            Console.WriteLine("============");
            actualStrings.ForEach(Console.WriteLine);
            CollectionAssert.AreEqual(actualStrings, expectedStrings);
        }

        [TestMethod]
        public void ShouldGiveFilesAndFolders()
        {
//            var actualFiles = browser.GetFiles(path);
//            var actualDirs = browser.GetDirectories(path);
//            List<FileSystemInfo> list = new List<FileSystemInfo>();
//            actualFiles.ToList().ForEach(x=>list.Add(x));
//            actualDirs.ToList().ForEach(x=>list.Add(x));
//
//            var actualStrings = list.ToList().Select(x => x.ToString()).ToList();


            var actual = browser.GetFilesAndDirectories(path);
            var actualStrings = actual.ToList().Select(x => x.ToString()).ToList();
            Console.WriteLine("============");
            actualStrings.ForEach(Console.WriteLine);

            var expected = new DirectoryInfo(path).GetFileSystemInfos();
            var expectedStrings = expected.ToList().Select(x => x.ToString()).ToList();


            expectedStrings.Sort((s, s1) => String.Compare(s, s1, StringComparison.InvariantCulture));
            actualStrings.Sort((s, s1) => String.Compare(s, s1, StringComparison.InvariantCulture));
            CollectionAssert.AreEqual(actualStrings, expectedStrings);
        }
    }
}
