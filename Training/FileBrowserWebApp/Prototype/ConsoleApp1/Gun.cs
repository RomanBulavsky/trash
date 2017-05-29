using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Gun : IWeapon
    {
        public void Kill()
        {
            Console.WriteLine("Kill Gun");
        }
    }
}
