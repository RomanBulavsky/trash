using System;
using System.Collections.Generic;
using System.IO;
using Bll.Interfaces;

namespace Bll
{
    public class FileSystemProvider : IFileSystemProvider
    {
        #region CREATE

        public void CreateFile(string path, string name)
        {
            CheckUpStrings(path);
            CheckUpStrings(name);
            IsFolderExist(path);

            var newFilePath = Path.Combine(Path.GetFullPath(path), name);
            using (File.Create(newFilePath))
            {
                //TODO: log + if file or folder exist do you need exception
            }
        }

        public void CreateFolder(string path, string name)
        {
            CheckUpStrings(path);
            CheckUpStrings(name);
            IsFolderExist(path);
            var newDirectoryPath = Path.Combine(Path.GetFullPath(path), name);
            Directory.CreateDirectory(newDirectoryPath);
        }

        #endregion

        #region READ

        public IEnumerable<DriveInfo> GetDrives()
        {
            return DriveInfo.GetDrives();
        }

        public IEnumerable<DirectoryInfo> GetFolders(string path)
        {
            CheckUpStrings(path);
            IsFolderExist(path);

            return new DirectoryInfo(Path.GetFullPath(path)).GetDirectories();
        }

        public IEnumerable<FileInfo> GetFiles(string path)
        {
            CheckUpStrings(path);
            IsFolderExist(path);

            return new DirectoryInfo(Path.GetFullPath(path)).GetFiles();
        }

        public IEnumerable<FileSystemInfo> GetFileSystemInfos(string path)
        {
            throw new NotImplementedException();
        }

        #endregion

        #region UPDATE_Names

        public void UpdateFileName(string path, string oldName, string newName)
        {
            CheckUpStrings(path);
            CheckUpStrings(oldName);
            CheckUpStrings(newName);
            IsFileExist(Path.Combine(path, oldName));

            var fullPath = Path.GetFullPath(path);
            File.Move(Path.Combine(fullPath, oldName), Path.Combine(fullPath, newName));
        }

        public void UpdateFolderName(string path, string oldName, string newName)
        {
            CheckUpStrings(path);
            CheckUpStrings(oldName);
            CheckUpStrings(newName);
            var comb = Path.Combine(path, oldName);
            IsFolderExist(Path.Combine(path, oldName));
                

            var fullPath = Path.GetFullPath(path);
            Directory.Move(Path.Combine(fullPath, oldName), Path.Combine(fullPath, newName));
        }

        #endregion

        #region DELETE

        public void DeleteFile(string path)
        {
            CheckUpStrings(path);
            IsFileExist(path);

            File.Delete(Path.GetFullPath(path));
        }

        public void DeleteFolder(string path)
        {
            CheckUpStrings(path);
            IsFolderExist(path);
               
            Directory.Delete(Path.GetFullPath(path),true);
        }

        #endregion

        #region Checkers
        //TODO:class pathChecker
        private void IsFolderExist(string path)
        {
            if (!Directory.Exists(Path.GetFullPath(path)))
            {
                throw new DirectoryNotFoundException();
            }
        }

        private void IsFileExist(string path)
        {
            if (!File.Exists(Path.GetFullPath(path)))
            {
                throw new FileNotFoundException();
            }
        }

        private void CheckUpStrings(string str)
        {
            if (!string.IsNullOrEmpty(str)) return;
            throw new ArgumentException("Unappropriate input parametor");
        }

        #endregion 
    }
}