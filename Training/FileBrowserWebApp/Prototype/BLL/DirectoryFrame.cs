using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    class DirectoryFrame
    {

        DirectoryInfo rootDirectory;

        public DirectoryInfo RootDirectoryInfo => rootDirectory;

        public List<DirectoryInfo> dirsList = new List<DirectoryInfo>();
        public List<DirectoryInfo> DirsList => dirsList;
        private List<FileInfo> filesList = new List<FileInfo>();
        public List<FileInfo> FilesList => filesList;

        public DirectoryFrame(DirectoryInfo rootDirectory)
        {
            this.rootDirectory = rootDirectory;
            FillDirsList(rootDirectory);
            FillFilesList(rootDirectory);
        }

        private void FillDirsList(DirectoryInfo selectedDirInfo)
        {
            var directoryInfos = selectedDirInfo?.GetDirectories();
            if (directoryInfos == null) return;
            foreach (var dir in directoryInfos)
                dirsList.Add(dir);
        }
        private void FillFilesList(DirectoryInfo selectedDirectory)
        {
            var directoryFiles = selectedDirectory?.GetFiles();
            if (directoryFiles == null) return;
            foreach (var file in directoryFiles)
                filesList.Add(file);
        }
    }
}
