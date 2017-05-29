using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using Microsoft.Practices.Unity.Configuration;

namespace ConsoleApp1
{
    class Program
    {
        static void Main(string[] args)
        {
            IUnityContainer container = new UnityContainer();
            Console.WriteLine(nameof(Warrior));
            Console.WriteLine(nameof(IWarrior));
            Console.WriteLine(Type.GetType(typeof(Warrior).AssemblyQualifiedName));
            container.LoadConfiguration();

            var war = container.Resolve<IWarrior>();


            //war.Kill();
        }
    }
}