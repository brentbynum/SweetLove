
macro index {
    case {
        $macName $name {
            [$idxCol:lit (,) ...] $ord
        }
    } => {
        var table = makeIdent("table", #{$macName});

        letstx $table = [table];
        return #{
            $table.addIndex($name, [$idxCol (,) ...], false, lf.Order.$ord);
        }
    }
    case {
        $macName $name {
            [$idxCol:lit (,) ...] $ord *
        }
    } => {
        var table = makeIdent("table", #{$macName});

        letstx $table = [table];
        return #{
            $table.addIndex($name, [$idxCol (,) ...], true, lf.Order.$ord);
        }
    }
}
macro col {
    case {
        $macName [$name:lit : $type:ident]
    } => {
        var table = makeIdent("table", #{$macName});

        letstx $table = [table];
        return #{
            $table.addColumn($name, lf.Type.$type)
        }
    }
    case {
        $macName [$name:lit : $type:ident : *]
    } => {
        var table = makeIdent("table", #{$macName});
        var pk = makeIdent("pk", #{$macName});
        letstx $table = [table];
        letstx $pk = [pk];
        return #{
            $table.addColumn($name, lf.Type.$type)
            $pk.push($name);
        }
    }
}

let table = macro {
    case {
        $macName $tableName:lit {
            $([$colParams ...]) ...
        }
    } => {
        var builder = makeIdent("builder", #{$macName});
        var pk = makeIdent("pk", #{$macName});
        letstx $builder = [builder];

        return #{
            (function() {
                var table = $builder.createTable($tableName)
                var pk = [];
                $(col[$colParams (:) ...]) ...
                if(pk.length){
                    table.addPrimaryKey(pk);
                }
            })();
        }
    }

    case {
        $macName $tableName:lit {
            $([$colParams ...]) ...
            index $idx{
                [$idxCol:lit (,) ...] $($idxParams ...)
            }
        }
    } => {
        var builder = makeIdent("builder", #{$macName});
        var pk = makeIdent("pk", #{$macName});
        letstx $builder = [builder];

        return #{
            (function() {
                var table = $builder.createTable($tableName)
                var pk = [];
                $(col[$colParams (:) ...]) ...
                if(pk.length){
                    table.addPrimaryKey(pk);
                }
                index $idx {
                    [$idxCol (,) ...] $idxParams ...
                }
            })();
        }
    }
}

let schema = macro {
    case {
        $macName $dbName:lit { $body ... }
    } => {
        var builder = makeIdent("builder", #{$macName});
        letstx $builder = [builder];
        return #{
            (function(){
                var $builder = lf.schema.create($dbName, 1);
                $body ...

                return $builder;
            })();
        }
    }
}

macro open {
    case {
        $macName $dbBuilder as $alias {
            $body ...
        }
    } => {

        return #{
           $dbBuilder.connect().then(function($alias){
                $body ...
           });
        }
    }
}


export col;
export table;
export schema;
export open;