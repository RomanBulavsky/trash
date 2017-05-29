using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ConsoleFSTrainer
{
    internal class Program
    {
        //static DirectoryInfo directoryInfo = new DirectoryInfo(@"C:\");
        private static readonly List<DriveInfo> driveList = new List<DriveInfo>();
        private static List<DirectoryInfo> dirsList = new List<DirectoryInfo>();
        private static List<FileInfo> filesList = new List<FileInfo>();

        private static IEnumerable<string> disksStrings = new List<string>();
        private static IEnumerable<string> dirsStrings = new List<string>();
        private static IEnumerable<string> filesStrings = new List<string>();

        private static void Main(string[] args)
        {
            FillDriversList();
            FillDirsList(driveList?.FirstOrDefault());
            FillFilesList(driveList?.FirstOrDefault()?.RootDirectory);

            disksStrings = driveList?.Select(x => x.ToString()).ToList();
            dirsStrings = dirsList?.Select(x => x.ToString()).ToList();
            filesStrings = filesList?.Select(x => x.ToString()).ToList();

            //driveList?.ForEach(Console.WriteLine);
            disksStrings?.ToList().ForEach(Console.WriteLine);
            Console.WriteLine("DIRS:_______");
            dirsStrings?.ToList().ForEach(Console.WriteLine);
            Console.WriteLine("FILES:______");
            filesStrings?.ToList().ForEach(Console.WriteLine);
            string query = null;
            DirectoryInfo frameRoot = driveList.First().RootDirectory;
            DirectoryInfo fatherFrame = driveList.First().RootDirectory;

            DirectoryFrame frame = new DirectoryFrame(frameRoot);

            while (query != "exit")
            {

                Console.WriteLine("WORK_________________________________________");
                query = Console.ReadLine();
                if (query == "../")
                {
                    frame = new DirectoryFrame(fatherFrame);
                    //fatherFrame = frame.RootDirectoryInfo.Parent;
                }
            else {
                    if(fatherFrame != driveList.First().RootDirectory)
                    fatherFrame = frame.RootDirectoryInfo.Parent;
                    frameRoot = frame.dirsList.Find(x => x.ToString() == query);
                    frame = new DirectoryFrame(frameRoot);
                }
                DirectoryFrameForJson dffj = new DirectoryFrameForJson(frame);
                Console.WriteLine(dffj);
            }
        }

        private static void FillDriversList()
        {
            foreach (var drives in DriveInfo.GetDrives())
                driveList.Add(drives);
        }

        private static void FillDirsList(DriveInfo selectedDriveInfo)
        {
            var directoryInfos = selectedDriveInfo?.RootDirectory.GetDirectories();
            if (directoryInfos == null) return;
                foreach (var dir in directoryInfos)
                    dirsList.Add(dir);
        }
        private static void FillFilesList(DirectoryInfo selectedDirectory)
        {
            var directoryFiles = selectedDirectory?.GetFiles();
            if (directoryFiles == null) return;
            foreach (var file in directoryFiles)
                filesList.Add(file);
        }
    }
}