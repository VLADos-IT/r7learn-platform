using Microsoft.EntityFrameworkCore;
using R7L;
using R7L.Services.User;
using R7L.Services.Course;
using R7L.Services.CourseUnit;
using R7L.Services.CourseProgress;
using R7L.Services.Test;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using R7L.Services.Resource;
using System.Net.Http;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient<ResourceProcessingService>();
builder.Services.AddScoped<ResourceProcessingService>();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseLazyLoadingProxies().UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICourseService, CourseService>();
builder.Services.AddScoped<ICourseUnitService, CourseUnitService>();
builder.Services.AddScoped<ICourseProgressService, CourseProgressService>();
builder.Services.AddScoped<ITestService, TestService>();

var jwtSecret = builder.Configuration["JWT_SECRET"];
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        ClockSkew = TimeSpan.FromMinutes(2),
        RoleClaimType = ClaimTypes.Role
    };
});

builder.Services.AddAuthorization();
builder.Services.AddControllers();


var app = builder.Build();


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();