using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FS;

namespace FSConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                Browser b = new Browser(DriveInfo.GetDrives().First().RootDirectory);
                var x = b.GetDirectories("Home");
                //Console.WriteLine(x);
                b.CreateFile("file","txt");

            }
            catch (Exception e)
            {
                Console.WriteLine(e.GetType() + e.Message);
            }
        }
    }
}
