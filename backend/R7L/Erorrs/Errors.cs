using System.Data;

namespace R7L.Erorrs;

public class Errors
{
    public static KeyNotFoundException KeyNotFound(string objectName, string keyName, object keyValue)
    {
        return new KeyNotFoundException
            ($"object '{objectName}' with '{keyName}' = '{keyValue}' not found");
    }

    public static DuplicateNameException Duplicate(string duplicateValueName)
    {
        return new DuplicateNameException
            ($"value '{duplicateValueName}' is not unique");
    }
}
