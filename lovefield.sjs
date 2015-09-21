
macro index {
    case {
        $mac_name $name {
            [$idxCol:lit (,) ...] $ord
        }
    } => {
        var table = makeIdent("table", #{$mac_name});

        letstx $table = [table];
        return #{
            $table.addIndex($name, [$idxCol (,) ...], false, lf.Order.$ord);
        }
    }
    case {
        $mac_name $name {
            [$idxCol:lit (,) ...] $ord *
        }
    } => {
        var table = makeIdent("table", #{$mac_name});

        letstx $table = [table];
        return #{
            $table.addIndex($name, [$idxCol (,) ...], true, lf.Order.$ord);
        }
    }
}
macro col {
    case {
        $mac_name [$name:lit : $type:ident]
    } => {
        var table = makeIdent("table", #{$mac_name});

        letstx $table = [table];
        return #{
            $table.addColumn($name, lf.Type.$type)
        }
    }
    case {
        $mac_name [$name:lit : $type:ident : *]
    } => {
        var table = makeIdent("table", #{$mac_name});
        var pk = makeIdent("pk", #{$mac_name});
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
        $mac_name $tableName:lit {
            $([$colParams ...]) ...
        }
    } => {
        var builder = makeIdent("builder", #{$mac_name});
        var pk = makeIdent("pk", #{$mac_name});
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
        $mac_name $tableName:lit {
            $([$colParams ...]) ...
            index $idx{
                [$idxCol:lit (,) ...] $($idxParams ...)
            }
        }
    } => {
        var builder = makeIdent("builder", #{$mac_name});
        var pk = makeIdent("pk", #{$mac_name});
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
        $mac_name $dbName:lit { $body ... }
    } => {
        var builder = makeIdent("builder", #{$mac_name});
        letstx $builder = [builder];
        return #{
            (function(){
                var $builder = lf.schema.create($dbName, 1);
                $body ...
            })();
        }
    }
}

export schema;
