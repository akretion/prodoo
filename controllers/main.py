import json
from werkzeug.utils import redirect

from odoo import http, registry
from odoo.http import request


class Prodoo(http.Controller):

    @http.route('/prodoo', type='http', auth="public")
    def prodoo(self, **kw):
        return redirect("/prodoo/static/src/index.html")