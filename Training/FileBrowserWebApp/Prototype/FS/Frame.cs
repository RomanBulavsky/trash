using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FS
{
    class Frame
    {
        public string Path { get; set; }
        private DirectoryInfo Parent { get; }
        private IEnumerable<FileSystemInfo> FilesAndDirectories { get; }

        public Frame(IBrowser browser, string path)
        {
            Path = path;
            Parent = browser.GetParent();
            FilesAndDirectories = browser.GetFilesAndDirectories(path);
        }
    }
}
