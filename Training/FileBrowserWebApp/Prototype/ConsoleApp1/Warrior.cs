using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Warrior : IWarrior
    {
        private readonly IWeapon weapon;

        public Warrior(IWeapon weapon)
        {
            this.weapon = weapon;
        }
        public void Kill()
        {
            weapon.Kill();
        }
    }
}
