var act = (function() {
    function htmlData(value) {
        var r;
        if (value instanceof Function) {
            r = htmlData(value());
        } else if (value instanceof Array) {
            r = document.createDocumentFragment();
            for (var i = 0; i < value.length; i++) {
                r.appendChild(htmlData(value[i]));
            }
        } else if (typeof value === 'object' && value !== null) {
            r = document.createElement(value.tag || htmlData.tag || 'div');
            for (var k in value) {
                if (value.hasOwnProperty(k)) {
                    if (k === 'data') r.appendChild(htmlData(value[k]));
                    else if (k === 'style') r.style.cssText = value[k];
                    else if (k !== 'tag') r[k] = value[k]
                }
            }
        } else r = document.createTextNode(value);
        return r
    }
    return function act(entity) {
        var f;
        if (entity === undefined || entity === null) throw new Error('act(undefined or null entity) is not allowed');
        if (entity instanceof Function) {
            f = function(value) {
                var v, oa = act.act, od = Act.dps; act.act = Act; Act.dps = [];
                v = arguments.length ? entity(value) : entity();
                if (oa === undefined) delete act.act; else act.act = oa;
                if (od) od.forEach(function(d) {
                    if (!Act.dps.includes(d)) d.wts = d.wts.filter(function(t) { return t !== Act })
                });
                return v
            }
        } else if (entity === location) {
            f = function(value) {
                if (arguments.length) {
                    return(location = value).toString()
                } else {
                    return location.toString()
                }
            }
        } else if (entity instanceof HTMLInputElement) {
            f = function(value) {
                if (arguments.length) {
                    Act.v = value;
                    if (value instanceof Array) value = value.join(', ');
                    else if (typeof value === 'object' && value !== null) {
                        for (var k in Act.v) {
                            if (value.hasOwnProperty(k)) {
                                if (k === 'data') value = Act.v[k];
                                else if (k === 'style') style(entity, Act.v[k]);
                                else entity[k] = Act.v[k]
                            }
                        }
                    }
                    entity.value = value;
                    return Act.v
                } else {
                    return entity.value
                }
            };
            entity.addEventListener('input', function(event) { if (Act.wts) Act.wts.slice().forEach(function(w) { w() }) })
        } else if (entity instanceof HTMLHtmlElement) {
            f = function(value) {
                if (arguments.length) {
                    if (typeof value === 'object' && value !== null && !(value instanceof Array)) {
                        for (var k in Act.v) {
                            if (value.hasOwnProperty(k)) {
                                entity[k] = Act.v[k]
                            }
                        }
                    } else throw new Error('act(html)(non-object value) is not allowed')
                } else {
                    return Act.v
                }
            }
        } else if (entity instanceof HTMLElement) {
            f = function(value) {
                if (arguments.length) {
                    Act.v = value;
                    if (typeof value === 'object' && value !== null && !(value instanceof Array)) {
                        for (var k in Act.v) {
                            if (value.hasOwnProperty(k)) {
                                if (k === 'data') {
                                    entity.textContent = '';
                                    entity.appendChild(htmlData(Act.v[k]))
                                } else entity[k] = Act.v[k]
                            }
                        }
                    } else {
                        entity.textContent = '';
                        entity.appendChild(htmlData(value));
                    }
                    return value
                } else {
                    return Act.v
                }
            }
        } else if (entity instanceof Node) {
            f = function(value) {
                if (arguments.length) {
                    Act.v = value;
                    if (value instanceof Array) value = value.join(', ');
                    else if (typeof value === 'object' && value !== null) {
                        for (var k in Act.v) {
                            if (value.hasOwnProperty(k)) {
                                if (k === 'data') value = Act.v[k];
                                else entity[k] = Act.v[k]
                            }
                        }
                    }
                    entity.data = value;
                    return Act.v
                } else {
                    return entity.data
                }
            }
        } else f = function(value) {
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
                    if (Act.wts) Act.wts.slice().forEach(function(w) { w() })
                } else {
                    r = f()
                }
            } catch(e) { console.error(e); r = e } finally { delete Act.run }
            return r
        }
        Act();
        return Act
    }
})()