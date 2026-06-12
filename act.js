var act = (function() {
    return function(entity) {
        var f;
        if (entity instanceof Function) f = function(value) {
            var v, oa = act.act, od = Act.dps; act.act = Act; Act.dps = [];
            v = arguments.length ? entity(value) : entity();
            if (oa === undefined) delete act.act; else act.act = oa;
            if (od) od.forEach(function(d) {
                if (!Act.dps.includes(d)) d.wts = d.wts.filter(function(t) { return t !== Act })
            });
            return v
        }; else if (entity === location) f = function(value) {
            if (arguments.length) {
                return(location = value).toString()
            } else {
                return location.toString()
            }
        }; else if (entity instanceof HTMLInputElement) { f = function(value) {
            if (arguments.length) {
                return entity.value = value
            } else {
                return entity.value
            }
        }; entity.oninput = function() { if (Act.wts) Act.wts.slice().forEach(function(w) { w() }); }} else f = function(value) {
            if (arguments.length) {
                return entity = value
            } else {
                return entity
            }
        };
        function Act(value) {
            if (Act.run) throw new Error('Circular dependency detected', { cause: Act });
            Act.run = true;
            if (act.act) {
                if (!act.act.dps.includes(Act)) act.act.dps[act.act.dps.length] = Act;
                if (!(Act.wts || (Act.wts = [])).includes(act.act)) Act.wts[Act.wts.length] = act.act;
            }
            try {
                var r;
                if (arguments.length) {
                    r = f(value);
                    if (Act.wts) Act.wts.slice().forEach(function(w) { w() });
                } else {
                    r = f();
                }
            } catch(e) { console.error(e); r = e } finally { delete Act.run }
            return r
        }
        Act();
        return Act
    }
})()