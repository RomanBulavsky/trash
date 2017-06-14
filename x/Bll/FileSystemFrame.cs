using System;
using System.Collections.Generic;
using System.IO;
using Bll.Interfaces;

namespace Bll
{
    public class FileSystemFrame : IFileSystemFrame
    {
        public IEnumerable<DriveInfo> Drives { get; set; }
        public IEnumerable<DirectoryInfo> Folders { get; set; }
        public IEnumerable<FileInfo> Files { get; set; }
        public IFileSystemProvider FileSystemProvider { get; }
        public FileSystemFrame(IFileSystemProvider fileSystemProvider)
        {
            FileSystemProvider = fileSystemProvider;
            Drives = fileSystemProvider.GetDrives();
        }
        public void FillInFileSystemFrame(string path)
        {
            if (string.IsNullOrEmpty(path))
                throw new ArgumentException();

            var fullPathToDirectory = Path.GetFullPath(path);

            if (!Directory.Exists(fullPathToDirectory))
                throw new DirectoryNotFoundException();
            Folders = new DirectoryInfo(fullPathToDirectory).GetDirectories();
            Files = new DirectoryInfo(fullPathToDirectory).GetFiles();
        }

    }
}