using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace BLL
{
    public class BLL
    {
        
        private IEnumerable<string> disksStrings = new List<string>();
        private IEnumerable<string> dirsStrings = new List<string>();
        private IEnumerable<string> filesStrings = new List<string>();
        private void FillDriversList()
        {
            foreach (var drives in DriveInfo.GetDrives())
                Navigator.driveList.Add(drives);
        }

        private void FillDirsList(DriveInfo selectedDriveInfo)
        {
            var directoryInfos = selectedDriveInfo?.RootDirectory.GetDirectories();
            if (directoryInfos == null) return;
            foreach (var dir in directoryInfos)
                Navigator.dirsList.Add(dir);
        }
        private void FillFilesList(DirectoryInfo selectedDirectory)
        {
            var directoryFiles = selectedDirectory?.GetFiles();
            if (directoryFiles == null) return;
            foreach (var file in directoryFiles)
                Navigator.filesList.Add(file);
        }

        public BLL()
        {
            FillDriversList();
        }

        public string GetDirectory()
        {
            return Navigator.ToJson();
        }


        
    }
}
