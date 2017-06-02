using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FS
{
    public class Browser : IBrowser
    {
        private DirectoryInfo directoryInfo;

        public Browser(DirectoryInfo directoryInfo)
        {
            this.directoryInfo = directoryInfo;
        }

        public Browser(string path)
        {
            CheckPath(path);
            var dir = new DirectoryInfo(path);
            if (!dir.Exists) { throw new Exception("The directory doesn't exist!");}
            this.directoryInfo = new DirectoryInfo(path);
        }

        public IEnumerable<DriveInfo> GetDrives() => DriveInfo.GetDrives();


        public IEnumerable<DirectoryInfo> GetDirectories(string path)
        {
            CheckPath(path);
            if (Directory.Exists(directoryInfo.FullName + path))
            {
                Console.WriteLine("EXIST");
            }
            var dir = directoryInfo.GetFileSystemInfos().ToList().First(x => x.ToString() == path);
            
            //directoryInfo.MoveTo(dir.Name);
            var pp = Path.GetFullPath(directoryInfo.FullName);
            var xx = Path.Combine(directoryInfo.FullName, path);

            directoryInfo = new DirectoryInfo(xx);
            //Directory.Move(directoryInfo.FullName,xx); //TODO: twrows exceptions i can handle it here and give null for the customer
            return new DirectoryInfo(Path.GetFullPath(dir.FullName)).GetDirectories();//.directoryInfo.GetDirectories());
        }

        public IEnumerable<FileInfo> GetFiles(string path)
        {
            CheckPath(path);
            directoryInfo.MoveTo(path);
            return directoryInfo.GetFiles();
        }

        public IEnumerable<FileSystemInfo> GetFilesAndDirectories(string path)
        {
            CheckPath(path);
            directoryInfo.MoveTo(path);
            return directoryInfo.GetFileSystemInfos();
        }

        public DirectoryInfo GetParent() => directoryInfo.Parent;

        public void CreateFile(string name, string extension)
        {
            CheckPath(name);
            CheckPath(extension);
            string path = $@"C:/{name}.{extension}";//{directoryInfo.FullName}

            try
            {
                if (File.Exists(Path.GetFullPath(path)))
                {
                    File.Delete(path);
                }

                // Create the file.
                using (FileStream fs = File.Create(path))
                {
                    //Byte[] info = new UTF8Encoding(true).GetBytes("This is some text in the file.");
                    //// Add some information to the file.
                    //fs.Write(info, 0, info.Length);
                }

//                // Open the stream and read it back.
//                using (StreamReader sr = File.OpenText(path))
//                {
//                    string s = "";
//                    while ((s = sr.ReadLine()) != null)
//                    {
//                        Console.WriteLine(s);
//                    }
//                }
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        private void CheckPath(string path)
        {
            if (string.IsNullOrEmpty(path))
                throw new ArgumentException();
        }
    }
}