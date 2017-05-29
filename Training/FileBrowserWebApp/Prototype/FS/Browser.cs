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
        private readonly DirectoryInfo directoryInfo;

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
            var dir = directoryInfo.GetFileSystemInfos().ToList().First(x => x.ToString() == path);

            directoryInfo.MoveTo(dir.Name);
            //directoryInfo.MoveTo(path); //TODO: twrows exceptions i can handle it here and give null for the customer
            return new DirectoryInfo(path).GetDirectories();//.directoryInfo.GetDirectories());
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

                // Delete the file if it exists.
                if (File.Exists(path))
                {
                    // Note that no lock is put on the
                    // file and the possibility exists
                    // that another process could do
                    // something with it between
                    // the calls to Exists and Delete.
                    File.Delete(path);
                }

                // Create the file.
                using (FileStream fs = File.Create(path))
                {
                    Byte[] info = new UTF8Encoding(true).GetBytes("This is some text in the file.");
                    // Add some information to the file.
                    fs.Write(info, 0, info.Length);
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