using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FS
{
    public interface IBrowser
    {
        IEnumerable<DriveInfo> GetDrives();
        IEnumerable<DirectoryInfo> GetDirectories(string path);
        IEnumerable<FileInfo> GetFiles(string path);
        IEnumerable<FileSystemInfo> GetFilesAndDirectories(string path);
        DirectoryInfo GetParent();
    }
}