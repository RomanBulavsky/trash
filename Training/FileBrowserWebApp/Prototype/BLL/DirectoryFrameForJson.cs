using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace BLL
{
    class DirectoryFrameForJson
    {
        private string diskString;
        public string DiskString => diskString;
        private IEnumerable<string> dirsStrings = new List<string>();
        public IEnumerable<string> DirsStrings => dirsStrings;
        private IEnumerable<string> filesStrings = new List<string>();
        public IEnumerable<string> FilesStrings => filesStrings;

        public DirectoryFrameForJson(List<String> dirs, List<String> files, string disk)
        {
            diskString = disk;
            dirsStrings = dirs;
            filesStrings = files;
        }
        public DirectoryFrameForJson(DirectoryFrame dframe)
        {
            diskString = dframe.RootDirectoryInfo.ToString();
            dirsStrings = dframe.DirsList.Select(x => x.ToString());
            filesStrings = dframe.FilesList.Select(x => x.ToString());
        }

        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();

            var s = $"{diskString}\n";
            var folders = dirsStrings.ToList().Select(x => $"---{x}\n").ToArray();
            var files = filesStrings.ToList().Select(x => $"---{x}\n").ToArray();
            sb.Append(s);
            foreach (var folder in folders)
            {
                sb.Append(folder);
            }
            foreach (var file in files)
            {
                sb.Append(file);
            }
            var json = new JavaScriptSerializer().Serialize(this);
            Console.WriteLine(json);
            return sb.ToString();
        }
    }
}
