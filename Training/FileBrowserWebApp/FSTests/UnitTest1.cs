using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace FSTests
{
    [TestClass]
    public class UnitTest1
    {
        public delegate int Mydel(int x, int y);

        [TestMethod]
        public void TestGetValue()
        {
            //AAA
            var ts = new TestClass();
            var result = 12;
            Assert.AreEqual(result, ts.GetValue());
        }

        [TestMethod]
        public void TestSum()
        {
            //AAA
            var ts = new TestClass();
            var result = 12;
            Assert.AreEqual(result, ts.Sum(12, 0));
        }

        [DataTestMethod]
        [DataRow(-1)]
        [DataRow(0)]
        [DataRow(1)]
        public void UserTester(int value)
        {
            var mock = new Mock<ITestClass>();
            mock.Setup(a => a.GetValue()).Returns(12);
            Mydel m = (x, y) => x + y;
            mock.Setup(a => a.Sum(It.IsAny<int>(), It.IsAny<int>())).Returns((int x, int y) => x + y);

            Mydel z = (kk, k) => 12;
            Console.WriteLine(
                z(12, 11));
            var mmmm = mock.Object.Sum(12, 12);
            var user = new User(mock.Object);
            var expected = value + value;
            Assert.AreEqual(expected, user.MeThatUsedTestClassToGetSum(value));
        }

        [DataTestMethod]
        [DataRow(-1)]
        [DataRow(0)]
        [DataRow(1)]
        public void OldUserTester(int value)
        {
            var user = new User(new TestClass());
            var expected = value + value;
            Assert.AreEqual(expected, user.MeThatUsedTestClassToGetSum(value));
        }
    }

    public interface ITestClass
    {
        int GetValue();
        int Sum(int a, int b);
    }

    internal class TestClass : ITestClass
    {
        private readonly int field = 12;

        public int GetValue()
        {
            return field;
        }

        public int Sum(int a, int b)
        {
            return a + b;
        }
    }

    internal class User
    {
        private readonly ITestClass summer;

        public User(ITestClass summer)
        {
            this.summer = summer;
        }

        public int MeThatUsedTestClassToGetSum(int one) => summer.Sum(one, one);
    }
}