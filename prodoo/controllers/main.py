import json
from werkzeug.utils import redirect

from odoo import http, registry
from odoo.http import request


class Prodoo(http.Controller):

    @http.route('/prodoo', type='http', auth="public")
    def prodoo(self, **kw):
        return redirect("/prodoo/static/src/index.html")
    

    @http.route('/prodoo/environnement', type='http', auth="public")
    def prodoo_environnement(self, **kw):
        return request.env['ir.config_parameter'].sudo().get_param('ribbon.name', "False")