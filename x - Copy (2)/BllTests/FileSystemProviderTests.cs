using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Bll;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BllTests
{
    [TestClass]
    public class FileSystemProviderTests
    {

        private FileSystemProvider fileSystemProvider;
        //TODO: DELETE
        [TestMethod]
        public void BC()
        {
            var path = @"C:\Home\Temp";

            var a = path.Split('\\');
            var paths = new List<string>();
            var paths2 = new List<string>();
            paths.AddRange(Path.GetFullPath(path).Split(Path.DirectorySeparatorChar));

            var x = paths.ToList().Select(z => z).ToList();
            foreach (var p in paths)
            {
                paths2.Add(string.Join(Path.DirectorySeparatorChar.ToString(),x.ToArray()));
                var s = paths[x.Count - 1];
                x.Remove(s);
            }


            for (var i = 0; i < a.Length; i++)
            {
                //if (i == 0) paths.Add(a[i] + "\\");
                for (var j = 0; j < i+1; j++)
                    if (j == 0) paths.Add(a[j] + "\\");
                    else
                        paths[i] += a[j]+ "\\";
            }

            foreach (var path1 in paths)
                Console.WriteLine(path1);
        }




        #region Init

        [TestInitialize]
        public void Init()
        {
            fileSystemProvider = new FileSystemProvider();
        }

        #endregion

        #region FileTests_Positive
        [TestMethod]
        public void CreateFile_RightParams_CreateFile()
        {
            fileSystemProvider.CreateFile(@"C:\Home\Temp", "1.txt");
            using (var f = File.Open(@"C:\Home\Temp\1.txt", FileMode.Open))
            {
                Assert.IsTrue(f.CanRead);
            }
            File.Delete(@"C:\Home\Temp\1.txt");
        }

        [TestMethod]
        public void DeleteFile_RightParams_DeleteFile()
        {
            using (File.Create(@"C:\Home\Temp\1.txt"))
            {
            }
            fileSystemProvider.DeleteFile(@"C:\Home\Temp\1.txt");
            Assert.IsFalse(File.Exists(@"C:\Home\Temp\1.txt"));
        }

        [TestMethod]
        public void UpdateFileName_RightParams_UpdateFileName()
        {
            using (File.Create(@"C:\Home\Temp\1.txt"))
            {
                
            }
            fileSystemProvider.UpdateFileName(@"C:\Home\Temp\","1.txt","2.txt");
            Assert.IsTrue(File.Exists(@"C:\Home\Temp\2.txt"));
            File.Delete(@"C:\Home\Temp\2.txt");

        }

        #endregion

        #region DirectoryTest_Positive
        [TestMethod]
        public void CreateDirectory_RightParams_CreateDirectory()
        {
            fileSystemProvider.CreateFolder(@"C:\Home\Temp", "mydir");
            Assert.IsTrue(Directory.Exists(@"C:\Home\Temp\mydir"));
            Directory.Delete(@"C:\Home\Temp\mydir");
        }


        [TestMethod]
        public void DeleteDirectory_RightParams_DeleteDirectory()
        {
            Directory.CreateDirectory(@"C:\Home\Temp\xxx");
            fileSystemProvider.DeleteFolder(@"C:\Home\Temp\xxx");
            Assert.IsFalse(Directory.Exists(@"C:\Home\Temp\xxx"));
        }

        [TestMethod]
        public void UpdateDirectoryName_RightParams_UpdateDirectoryName()
        {
            Directory.CreateDirectory(@"C:\Home\Temp\tmp1");
            fileSystemProvider.UpdateFolderName(@"C:\Home\Temp\", "tmp1", "tmp2");
            Assert.IsTrue(Directory.Exists(@"C:\Home\Temp\tmp2"));
            Directory.Delete(@"C:\Home\Temp\tmp2");

        }
        #endregion

        #region READ_Operations_Positive

        [TestMethod] public void GetDrives_RightParams_ReturnAllDrives()
        {
            var actualDrives = fileSystemProvider.GetDrives();
            var actualNames = new List<string>();
            var expectedNames = new List<string>();

            foreach (var actualDrive in actualDrives)
                actualNames.Add(actualDrive.Name);
            foreach (var actualDrive in DriveInfo.GetDrives())
                expectedNames.Add(actualDrive.Name);

            CollectionAssert.AreEquivalent(expectedNames,actualNames);

        }
        [TestMethod]
        public void GetDirectories_RightParams_ReturnAllDirectories()
        {
            var path = Path.GetFullPath(@"C:\");
            var actualDirs = fileSystemProvider.GetFolders(path);
            var actualNames = new List<string>();
            var expectedNames = new List<string>();

            foreach (var dir in actualDirs)
                actualNames.Add(dir.Name);
            foreach (var dir in new DirectoryInfo(path).GetDirectories())
                expectedNames.Add(dir.Name);

            CollectionAssert.AreEquivalent(expectedNames, actualNames);

        }

        [TestMethod]
        public void GetFiles_RightParams_ReturnAllFiles()
        {
            var path = Path.GetFullPath(@"C:\Home\");
            var actualFiles = fileSystemProvider.GetFiles(path);
            var actualNames = new List<string>();
            var expectedNames = new List<string>();

            foreach (var dir in actualFiles)
                actualNames.Add(dir.Name);
            foreach (var dir in new DirectoryInfo(path).GetFiles())
                expectedNames.Add(dir.Name);

            CollectionAssert.AreEquivalent(expectedNames, actualNames);

        }

        #endregion

        #region FileTests_Negative
        //TODO: Do I need to add some new exceptions? -> As for me nope but it will be better for tests. Different error for path and for names.
        [TestMethod]
        [ExpectedException(typeof(DirectoryNotFoundException))]
        public void CreateFile_WrongPathParam_ExceptionThrown()
        {
            fileSystemProvider.CreateFile(@"x:\Home\Temp", "1.txt");
        }
        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateFile_FirstParamIsNull_ExceptionThrown()
        {
            fileSystemProvider.CreateFile(null, "1.txt");
        }
        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateFile_SecondParamIsNull_ExceptionThrown()// TODO: the same tests
        {
            fileSystemProvider.CreateFile("c:/txt", null);
        }

        [TestMethod]
        [ExpectedException(typeof(FileNotFoundException))]
        public void DeleteFile_WrongPath_ExceptionThrown()
        {
            fileSystemProvider.DeleteFile(@"x:\Home\Temp\1.txt");
        }
        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void DeleteFile_NullParam_ExceptionThrown()
        {
            fileSystemProvider.DeleteFile(null);
        }

        [TestMethod]
        [ExpectedException(typeof(FileNotFoundException))]
        public void UpdateFileName_WrongPath_ExceptionThrown()
        {
            fileSystemProvider.UpdateFileName(@"x:\Home\Temp\", "1.txt", "2.txt");
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void UpdateFileName_NullParam_ExceptionThrown()
        {
            fileSystemProvider.UpdateFileName(@"x:\Home\Temp\", null, "2.txt");
        }

        #endregion

        #region DirectoryTest_Negative
        [TestMethod]
        [ExpectedException(typeof(DirectoryNotFoundException))]
        public void CreateDirectory_WrongPathParam_ExceptionThrown()
        {
            fileSystemProvider.CreateFolder(@"x:\Home\Temp", "mydir");
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateDirectory_NullParam_ExceptionThrown()
        {
            fileSystemProvider.CreateFolder(@"x:\Home\Temp", null);
        }


        [TestMethod]
        [ExpectedException(typeof(DirectoryNotFoundException))]
        public void DeleteDirectory_WrongPathParam_ExceptionThrown()
        {
            fileSystemProvider.CreateFolder(@"x:\Home\Temp\xxx","newFolder");
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void DeleteDirectory_NullPathParam_ExceptionThrown()
        {
            fileSystemProvider.CreateFolder(null,"newFolder");
        }

        [TestMethod]
        [ExpectedException(typeof(DirectoryNotFoundException))]
        public void UpdateDirectoryName_WrongPathParam_ExceptionThrown()
        {
            fileSystemProvider.UpdateFolderName(@"x:\Home\Temp\", "tmp1", "tmp2");

        }
        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void UpdateDirectoryName_NUllPathParam_ExceptionThrown()
        {
            fileSystemProvider.UpdateFolderName(@"C:\Home\Temp\", null, "tmp2");

        }
        #endregion

    }
}