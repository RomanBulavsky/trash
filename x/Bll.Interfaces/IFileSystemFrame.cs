using System.Collections.Generic;
using System.IO;

namespace Bll.Interfaces
{
    public interface IFileSystemFrame
    {
        IEnumerable<DriveInfo> Drives { get; set; }
        IEnumerable<DirectoryInfo> Folders { get; set; }
        IEnumerable<FileInfo> Files { get; set; }

        IFileSystemProvider FileSystemProvider { get; }

        void FillInFileSystemFrame(string path);
    }
}
