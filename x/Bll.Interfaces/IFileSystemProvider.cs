using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bll.Interfaces
{
    public interface IFileSystemProvider
    {
        /// <summary>
        /// CREATE
        /// </summary>
        void CreateFile(string path, string name);
        void CreateFolder(string path, string name);
        /// <summary>
        /// READ
        /// </summary>
        /// <returns></returns>
        IEnumerable<DriveInfo> GetDrives();
        IEnumerable<DirectoryInfo> GetDirectories(string path);
        IEnumerable<FileInfo> GetFiles(string path);
        IEnumerable<FileSystemInfo> GetFileSystemInfos(string path); // TODO: think about it -> I think it is not necessary method
        /// <summary>
        /// UPDATE //TODO: expend? + logic
        /// </summary>
        void UpdateFileName(string path, string oldName, string newName);
        void UpdateFolderName(string path, string oldName, string newName);
        /// <summary>
        /// DELETE
        /// </summary>
        void DeleteFile(string path);
        void DeleteFolder(string path);



    }
}
