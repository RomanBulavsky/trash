using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace BLL
{
    public static class Navigator
    {
        public static readonly List<DriveInfo> driveList = new List<DriveInfo>();
        public static List<DirectoryInfo> dirsList = new List<DirectoryInfo>();
        public static List<FileInfo> filesList = new List<FileInfo>();
        public static string ToJson()
        {
            StringBuilder sb = new StringBuilder();

            var drives = new List<string>();

            driveList.ForEach(x => drives.Add(x.ToString()));


            //var json = new JavaScriptSerializer().Serialize(drives);
            //Console.WriteLine(json);
            string str = String.Empty;

            foreach (var drive in drives)
            {
                str += drive;
            }
            return str;
        }
    }
}
