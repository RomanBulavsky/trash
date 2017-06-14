using System.Collections.Generic;
using System.IO;

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
        IEnumerable<DirectoryInfo> GetFolders(string path);
        IEnumerable<FileInfo> GetFiles(string path);
        /// <summary>
        /// UPDATE //TODO: Do I need to expand update logic?
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
