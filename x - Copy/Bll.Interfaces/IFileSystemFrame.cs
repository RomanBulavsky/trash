using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bll.Interfaces
{
    public interface IFileSystemFrame
    {
        IEnumerable<DriveInfo> Drives { get; set; }
        IEnumerable<DirectoryInfo> Directories { get; set; }
        IEnumerable<FileInfo> Files { get; set; }

        IFileSystemProvider FileSystemProvider { get; }

        void FillInFileSystemFrame(string path);
    }
}
