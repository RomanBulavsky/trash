﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PL.MVC.Models
{
    public class UserRoleViewModel
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public List<string> Roles { get; set; }
    }
}