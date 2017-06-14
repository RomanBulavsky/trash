using System.IO;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Bll;

namespace BllTests
{
    [TestClass]
    public class FileSystemFrameTests
    {
        private FileSystemFrame fileSystemFrame;

        #region Init

        [TestInitialize]
        public void Init()
        {
            fileSystemFrame = new FileSystemFrame(new FileSystemProvider());
        }

        #endregion

        [TestMethod]
        public void FillInFileSystemFrame_RightParams_FillInFileSystemFrameProperly()
        {
            var path = Path.GetFullPath("c:/Home");
            fileSystemFrame.FillInFileSystemFrame(path);
            var fsExpected = new FileSystemFrame(new FileSystemProvider());
            fsExpected.Folders = new DirectoryInfo(path).GetDirectories();
            fsExpected.Files = new DirectoryInfo(path).GetFiles();

            var xx = fsExpected.Folders.Select(x => x.Name).ToArray()[1];
            var yx = fileSystemFrame.Folders.Select(x => x.Name).ToArray()[1];
            var yeex = fsExpected.Files.Select(x => x.Name).ToArray()[1];
            var yex = fileSystemFrame.Files.Select(x => x.Name).ToArray()[1];

            Assert.AreEqual(fsExpected.Folders.Select(x => x.Name).ToArray()[1], fileSystemFrame.Folders.Select(x => x.Name).ToArray()[1]);
            Assert.AreEqual(fsExpected.Files.Select(x => x.Name).ToArray()[1], fileSystemFrame.Files.Select(x => x.Name).ToArray()[1]);
            Assert.AreEqual(fsExpected.Drives.Select(x => x.Name).ToArray()[0], fileSystemFrame.Drives.Select(x => x.Name).ToArray()[0]);

        }
    }
}
