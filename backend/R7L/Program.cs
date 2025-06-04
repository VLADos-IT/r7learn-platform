using Microsoft.EntityFrameworkCore;
using R7L;
using R7L.Services.User;
using R7L.Services.Course;
using R7L.Services.CourseUnit;
using R7L.Services.CourseProgress;
using R7L.Services.Test;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseLazyLoadingProxies().UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICourseService, CourseService>();
builder.Services.AddScoped<ICourseUnitService, CourseUnitService>();
builder.Services.AddScoped<ICourseProgressService, CourseProgressService>();
builder.Services.AddScoped<ITestService, TestService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5000);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontendAndAdmin", policy =>
    {
        policy.WithOrigins(
            "https://r7learn.xorg.su",
            "https://admin.r7learn.xorg.su"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// SERVER => DELETE LINE:
//app.UseAuthorization();


app.UseCors("AllowFrontendAndAdmin");


app.MapControllers();

app.Run();