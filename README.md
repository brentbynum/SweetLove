# SweetLove
This is a set of SweetJS macros for defining google lovefield schema.

# Usage
To describe your database schema, use the following syntax

    schema 'DatabaseName' {
        table 'TableName' {
            ['ColumnName' INTEGER *] //The star indicates that this is the primary key. 
            ['AnotherColumn' STRING] 
        }
        
        table 'AnotherTable' {
            ['Id1' INTEGER *]  // The primary key can be split amongst
            ['Id2' INTEGER *]  // multiple fields
            ['Argument' STRING]
            index 'idxArgument' {
                ['Argument'] ASC // You can specify and index as either ASCending or DESCending
            }
        }
        
        table 'MoreTable' {
            ['Id' INTEGER *]
            ['Name' STRING]
            ['CreationDate' DATETIME]
            index 'idxCreationName' {
                ['Name', 'CreationDate'] DESC * // You can use multiple fields in an index, and 
            }                                   // you can indicate that it's unique with the *
        }
        
    }

# Compilation

sjs lovefield.sjs --output sample.js sample