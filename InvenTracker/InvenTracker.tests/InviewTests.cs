using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using InvenTracker.Controllers;
using InvenTracker.Data;
using InvenTracker.DTO;
using InvenTracker.DTOs;
using InvenTracker.Models;
using InvenTracker.Repositories;
using InvenTracker.Services;
using Xunit;

namespace InvenTracker.tests
{
    public class InventoryTests
    {
        private static InventoryController CreateInventoryController(string dbName)
        {
            var options = new DbContextOptionsBuilder<InviewDbContext>()
                .UseInMemoryDatabase(dbName)
                .Options;

            var context = new InviewDbContext(options);
            var repo = new InventoryRepository(context);
            var service = new InventoryService(repo);
            return new InventoryController(service);
        }

        [Fact]
        public async Task Create_GeneratesAutoSku()
        {
            var options = new DbContextOptionsBuilder<InviewDbContext>()
                .UseInMemoryDatabase("InvDb1")
                .Options;

            using (var context = new InviewDbContext(options))
            {
                context.inventories.Add(new Inventory
                {
                    Id = 1,
                    Name = "Existing",
                    SKU = "INV000001",
                    Quantity = 0,
                    MinStock = 1,
                    Category = "Electronics",
                    Price = 10
                });
                await context.SaveChangesAsync();
            }

            var controller = CreateInventoryController("InvDb1");

            var dto = new InventoryCreateDto
            {
                Name = "Test Item",
                SKU = "",
                MinStock = 5,
                Category = "Electronics",
                Price = 100
            };

            var result = await controller.Create(dto);

            var created = Assert.IsType<CreatedAtActionResult>(result);
            var item = Assert.IsType<InventoryReadDto>(created.Value);

            Assert.StartsWith("INV", item.SKU);
            Assert.NotEqual("INV000001", item.SKU);
        }

        [Fact]
        public async Task Create_UsesProvidedSku()
        {
            var controller = CreateInventoryController("InvDb2");

            var dto = new InventoryCreateDto
            {
                Name = "Test Item",
                SKU = "TESTSKU",
                MinStock = 5,
                Category = "Test",
                Price = 100
            };

            var result = await controller.Create(dto);

            var created = Assert.IsType<CreatedAtActionResult>(result);
            var item = Assert.IsType<InventoryReadDto>(created.Value);
            Assert.Equal("TESTSKU", item.SKU);
        }

        [Fact]
        public async Task GetLowStock_ReturnsLowStockItems()
        {
            var options = new DbContextOptionsBuilder<InviewDbContext>()
                .UseInMemoryDatabase("InvDb3")
                .Options;

            using (var context = new InviewDbContext(options))
            {
                context.inventories.AddRange(
                    new Inventory
                    {
                        Name = "Item1",
                        SKU = "LSK001",
                        Quantity = 3,
                        MinStock = 5,
                        Category = "Laptop",
                        Price = 10
                    },
                    new Inventory
                    {
                        Name = "Item2",
                        SKU = "LSK002",
                        Quantity = 6,
                        MinStock = 5,
                        Category = "Laptop",
                        Price = 20
                    });
                await context.SaveChangesAsync();
            }

            var controller = CreateInventoryController("InvDb3");

            var result = await controller.GetLowStock();

            var ok = Assert.IsType<OkObjectResult>(result);
            var items = Assert.IsType<List<InventoryReadDto>>(ok.Value);
            Assert.Single(items);
            Assert.Equal("Item1", items[0].Name);
        }

        [Fact]
        public async Task GetAll_ReturnsAll()
        {
            var options = new DbContextOptionsBuilder<InviewDbContext>()
                .UseInMemoryDatabase("InvDb6")
                .Options;

            using (var context = new InviewDbContext(options))
            {
                context.inventories.AddRange(
                    new Inventory { Name = "Item1", SKU = "SKU1", Quantity = 5, MinStock = 2, Category = "Cat", Price = 10 },
                    new Inventory { Name = "Item2", SKU = "SKU2", Quantity = 8, MinStock = 3, Category = "Cat", Price = 20 }
                );
                await context.SaveChangesAsync();
            }

            var controller = CreateInventoryController("InvDb6");

            var result = await controller.GetAll();

            var ok = Assert.IsType<OkObjectResult>(result);
            var items = Assert.IsType<List<InventoryReadDto>>(ok.Value);
            Assert.Equal(2, items.Count);
        }

        [Fact]
        public async Task GetById_ReturnsItem()
        {
            var options = new DbContextOptionsBuilder<InviewDbContext>()
                .UseInMemoryDatabase("InvDb7")
                .Options;

            using (var context = new InviewDbContext(options))
            {
                var inv = new Inventory
                {
                    Id = 1,
                    Name = "Single",
                    SKU = "ONESKU",
                    Quantity = 4,
                    MinStock = 2,
                    Category = "Cat",
                    Price = 50
                };
                context.inventories.Add(inv);
                await context.SaveChangesAsync();
            }

            var controller = CreateInventoryController("InvDb7");

            var result = await controller.GetById(1);

            var ok = Assert.IsType<OkObjectResult>(result);
            var item = Assert.IsType<InventoryReadDto>(ok.Value);
            Assert.Equal("Single", item.Name);
        }

        [Fact]
        public async Task GetById_ReturnsNotFound()
        {
            var controller = CreateInventoryController("InvDb8");

            var result = await controller.GetById(99);

            Assert.IsType<NotFoundResult>(result);
        }
    }

    public class TransactionTests
    {
        private static TransactionController CreateTransactionController(string dbName)
        {
            var options = new DbContextOptionsBuilder<InviewDbContext>()
                .UseInMemoryDatabase(dbName)
                .Options;

            var context = new InviewDbContext(options);
            var repo = new TransactionRepository(context);
            var service = new TransactionService(repo);
            return new TransactionController(service);
        }

        [Fact]
        public async Task In_IncreasesQuantity()
        {
            var options = new DbContextOptionsBuilder<InviewDbContext>()
                .UseInMemoryDatabase("InvDb4")
                .Options;

            using (var context = new InviewDbContext(options))
            {
                context.inventories.Add(new Inventory
                {
                    Id = 1,
                    Name = "Test",
                    SKU = "TRNIN001",
                    Quantity = 10,
                    MinStock = 1,
                    Category = "Laptop",
                    Price = 10
                });
                await context.SaveChangesAsync();
            }

            var controller = CreateTransactionController("InvDb4");

            var dto = new TransactionCreateDto
            {
                InventoryId = 1,
                Type = "IN",
                Quantity = 5
            };

            var result = await controller.Create(dto);

            var created = Assert.IsType<CreatedAtActionResult>(result);
            var tx = Assert.IsType<TransactionReadDto>(created.Value);

            using var checkContext = new InviewDbContext(
                new DbContextOptionsBuilder<InviewDbContext>()
                    .UseInMemoryDatabase("InvDb4")
                    .Options);
            Assert.Equal(15, checkContext.inventories.First().Quantity);
        }

        [Fact]
        public async Task Out_DecreasesQuantity()
        {
            var options = new DbContextOptionsBuilder<InviewDbContext>()
                .UseInMemoryDatabase("InvDb5")
                .Options;

            using (var context = new InviewDbContext(options))
            {
                context.inventories.Add(new Inventory
                {
                    Id = 1,
                    Name = "Test",
                    SKU = "TRNOUT001",
                    Quantity = 10,
                    MinStock = 1,
                    Category = "Laptop",
                    Price = 10
                });
                await context.SaveChangesAsync();
            }

            var controller = CreateTransactionController("InvDb5");

            var dto = new TransactionCreateDto
            {
                InventoryId = 1,
                Type = "OUT",
                Quantity = 5
            };

            var result = await controller.Create(dto);

            var created = Assert.IsType<CreatedAtActionResult>(result);
            var tx = Assert.IsType<TransactionReadDto>(created.Value);

            using var checkContext = new InviewDbContext(
                new DbContextOptionsBuilder<InviewDbContext>()
                    .UseInMemoryDatabase("InvDb5")
                    .Options);
            Assert.Equal(5, checkContext.inventories.First().Quantity);
        }

        [Fact]
        public async Task Out_InsufficientStockReturnsError()
        {
            var options = new DbContextOptionsBuilder<InviewDbContext>()
                .UseInMemoryDatabase("InvDb9")
                .Options;

            using (var context = new InviewDbContext(options))
            {
                context.inventories.Add(new Inventory
                {
                    Id = 1,
                    Name = "LowStock",
                    SKU = "LOWOUT",
                    Quantity = 2,
                    MinStock = 1,
                    Category = "Laptop",
                    Price = 10
                });
                await context.SaveChangesAsync();
            }

            var controller = CreateTransactionController("InvDb9");

            var dto = new TransactionCreateDto
            {
                InventoryId = 1,
                Type = "OUT",
                Quantity = 5
            };

            var result = await controller.Create(dto);

            var bad = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Insufficient stock", bad.Value);
        }

        [Fact]
        public async Task GetAll_ReturnsAllTransactions()
        {
            var options = new DbContextOptionsBuilder<InviewDbContext>()
                .UseInMemoryDatabase("InvDb10")
                .Options;

            using (var context = new InviewDbContext(options))
            {
                var inv = new Inventory
                {
                    Id = 1,
                    Name = "Item",
                    SKU = "TXSKU",
                    Quantity = 10,
                    MinStock = 1,
                    Category = "Cat",
                    Price = 10
                };
                context.inventories.Add(inv);
                context.transactions.Add(new Transaction
                {
                    Id = 1,
                    InventoryId = 1,
                    Type = "IN",
                    Quantity = 5,
                    Staff = "User",
                    Remarks = "Test"
                });
                await context.SaveChangesAsync();
            }

            var controller = CreateTransactionController("InvDb10");

            var result = await controller.GetAll();

            var ok = Assert.IsType<OkObjectResult>(result);
            var list = Assert.IsType<List<TransactionReadDto>>(ok.Value);
            Assert.Single(list);
        }
    }

    public class AuthTests
    {
        private InviewDbContext CreateDb(string name)
        {
            var options = new DbContextOptionsBuilder<InviewDbContext>()
                .UseInMemoryDatabase(name)
                .Options;

            return new InviewDbContext(options);
        }

        private JwtService CreateJwt()
        {
            var settings = new[]
            {
                new KeyValuePair<string,string?>("Jwt:Key", "testkeytestkeytestkeytestkeytestkey123"),
                new KeyValuePair<string,string?>("Jwt:Issuer", "InvenTrackerAPI"),
                new KeyValuePair<string,string?>("Jwt:Audience", "InvenTrackerClient")
            };

            var config = new ConfigurationBuilder()
                .AddInMemoryCollection(settings)
                .Build();

            return new JwtService(config);
        }

        private AuthController CreateAuthController(string dbName)
        {
            var context = CreateDb(dbName);
            var jwt = CreateJwt();
            var userRepo = new UserRepository(context);
            var authService = new AuthService(userRepo, jwt);
            return new AuthController(authService);
        }

        [Fact]
        public async Task Register_NewUser()
        {
            var controller = CreateAuthController("AuthDb1");

            var dto = new Register
            {
                Username = "Abhi",
                Password = "password123",
                Role = "Staff"
            };

            var result = await controller.Register(dto);

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("User registered successfully", ok.Value);
        }

        [Fact]
        public async Task Register_DuplicateUser()
        {
            using (var context = CreateDb("AuthDb2"))
            {
                context.users.Add(new User
                {
                    Username = "Lasya",
                    PasswordHash = "secret",
                    Role = "Staff"
                });
                await context.SaveChangesAsync();
            }

            var controller = CreateAuthController("AuthDb2");

            var dto = new Register
            {
                Username = "Lasya",
                Password = "newpass",
                Role = "Admin"
            };

            var result = await controller.Register(dto);

            var bad = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Username already exists", bad.Value);
        }

        [Fact]
        public async Task Login_ValidUser()
        {
            using (var context = CreateDb("AuthDb3"))
            {
                context.users.Add(new User
                {
                    Username = "Balaji",
                    PasswordHash = "pass123",
                    Role = "Admin"
                });
                await context.SaveChangesAsync();
            }

            var controller = CreateAuthController("AuthDb3");

            var dto = new LoginDto
            {
                Username = "Balaji",
                Password = "pass123"
            };

            var result = await controller.Login(dto);
            var ok = Assert.IsType<OkObjectResult>(result);
            var auth = Assert.IsType<AuthResponseDto>(ok.Value);
            Assert.Equal("Balaji", auth.Username);
            Assert.False(string.IsNullOrWhiteSpace(auth.Token));
        }

        [Fact]
        public async Task Login_InvalidPassword()
        {
            using (var context = CreateDb("AuthDb4"))
            {
                context.users.Add(new User
                {
                    Username = "Suhas",
                    PasswordHash = "correct",
                    Role = "Staff"
                });
                await context.SaveChangesAsync();
            }

            var controller = CreateAuthController("AuthDb4");

            var dto = new LoginDto
            {
                Username = "Suhas",
                Password = "wrong"
            };

            var result = await controller.Login(dto);

            var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("Invalid credentials", unauthorized.Value);
        }
    }
}

