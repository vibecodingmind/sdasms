#!/usr/bin/env python3
"""
Bulk SMS Platform Technical Architecture Document
Generates comprehensive PDF covering database analysis, API design, and migration strategy.
"""

import os, hashlib, sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, mm
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    Image, KeepTogether, CondPageBreak
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.lib.utils import simpleSplit

# ─── Font Registration ───
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
pdfmetrics.registerFont(TTFont('Calibri', '/usr/share/fonts/truetype/english/calibri-regular.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')
registerFontFamily('Calibri', normal='Calibri', bold='Calibri')

# ─── Color Palette ───
PAGE_BG       = colors.HexColor('#f3f4f4')
SECTION_BG    = colors.HexColor('#ecedee')
CARD_BG       = colors.HexColor('#e4e7e9')
TABLE_STRIPE  = colors.HexColor('#f0f1f2')
HEADER_FILL   = colors.HexColor('#405057')
COVER_BLOCK   = colors.HexColor('#3f5a67')
BORDER        = colors.HexColor('#bdc6ca')
ICON          = colors.HexColor('#426475')
ACCENT        = colors.HexColor('#a5273c')
ACCENT_2      = colors.HexColor('#8b4abb')
TEXT_PRIMARY   = colors.HexColor('#1a1c1d')
TEXT_MUTED     = colors.HexColor('#6f7578')
SEM_SUCCESS   = colors.HexColor('#428458')
SEM_WARNING   = colors.HexColor('#937840')
SEM_ERROR     = colors.HexColor('#944038')
SEM_INFO      = colors.HexColor('#446b91')

TABLE_HEADER_COLOR = HEADER_FILL
TABLE_HEADER_TEXT  = colors.white
TABLE_ROW_EVEN     = colors.white
TABLE_ROW_ODD      = TABLE_STRIPE

# ─── Page Setup ───
PAGE_W, PAGE_H = A4
LEFT_M = 1.0 * inch
RIGHT_M = 1.0 * inch
TOP_M = 0.8 * inch
BOTTOM_M = 0.8 * inch
AVAIL_W = PAGE_W - LEFT_M - RIGHT_M
AVAIL_H = PAGE_H - TOP_M - BOTTOM_M

# ─── Styles ───
styles = getSampleStyleSheet()

style_h1 = ParagraphStyle(
    name='H1', fontName='Times New Roman', fontSize=22, leading=28,
    textColor=TEXT_PRIMARY, spaceBefore=18, spaceAfter=10, alignment=TA_LEFT
)
style_h2 = ParagraphStyle(
    name='H2', fontName='Times New Roman', fontSize=16, leading=22,
    textColor=HEADER_FILL, spaceBefore=14, spaceAfter=8, alignment=TA_LEFT
)
style_h3 = ParagraphStyle(
    name='H3', fontName='Times New Roman', fontSize=13, leading=18,
    textColor=ICON, spaceBefore=10, spaceAfter=6, alignment=TA_LEFT
)
style_body = ParagraphStyle(
    name='Body', fontName='Times New Roman', fontSize=10.5, leading=17,
    textColor=TEXT_PRIMARY, spaceBefore=3, spaceAfter=6, alignment=TA_JUSTIFY
)
style_bullet = ParagraphStyle(
    name='Bullet', fontName='Times New Roman', fontSize=10.5, leading=17,
    textColor=TEXT_PRIMARY, spaceBefore=2, spaceAfter=3, alignment=TA_LEFT,
    leftIndent=20, bulletIndent=8, bulletFontName='Times New Roman'
)
style_header_cell = ParagraphStyle(
    name='HeaderCell', fontName='Times New Roman', fontSize=10,
    textColor=colors.white, alignment=TA_CENTER, leading=14
)
style_cell = ParagraphStyle(
    name='Cell', fontName='Times New Roman', fontSize=9.5,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, leading=13
)
style_cell_center = ParagraphStyle(
    name='CellCenter', fontName='Times New Roman', fontSize=9.5,
    textColor=TEXT_PRIMARY, alignment=TA_CENTER, leading=13
)
style_caption = ParagraphStyle(
    name='Caption', fontName='Times New Roman', fontSize=9,
    textColor=TEXT_MUTED, alignment=TA_CENTER, spaceBefore=3, spaceAfter=6
)
style_toc_h1 = ParagraphStyle(name='TOCH1', fontSize=13, leftIndent=20, fontName='Times New Roman', spaceBefore=4)
style_toc_h2 = ParagraphStyle(name='TOCH2', fontSize=11, leftIndent=40, fontName='Times New Roman', spaceBefore=2)


# ─── TOC Document Template ───
class TocDocTemplate(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        if hasattr(flowable, 'bookmark_name'):
            level = getattr(flowable, 'bookmark_level', 0)
            text = getattr(flowable, 'bookmark_text', '')
            key = getattr(flowable, 'bookmark_key', '')
            self.notify('TOCEntry', (level, text, self.page, key))

def add_heading(text, style, level=0):
    key = 'h_%s' % hashlib.md5(text.encode()).hexdigest()[:8]
    p = Paragraph('<a name="%s"/>%s' % (key, text), style)
    p.bookmark_name = text
    p.bookmark_level = level
    p.bookmark_text = text
    p.bookmark_key = key
    return p

def safe_keep(elements):
    total_h = 0
    for el in elements:
        w, h = el.wrap(AVAIL_W, AVAIL_H)
        total_h += h
    if total_h <= AVAIL_H * 0.4:
        return [KeepTogether(elements)]
    elif len(elements) >= 2:
        return [KeepTogether(elements[:2])] + list(elements[2:])
    return list(elements)

def make_table(data, col_widths, has_header=True):
    t = Table(data, colWidths=col_widths, hAlign='CENTER')
    style_cmds = [
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
    ]
    if has_header:
        style_cmds.append(('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER_COLOR))
        style_cmds.append(('TEXTCOLOR', (0, 0), (-1, 0), TABLE_HEADER_TEXT))
        for i in range(1, len(data)):
            bg = TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD
            style_cmds.append(('BACKGROUND', (0, i), (-1, i), bg))
    t.setStyle(TableStyle(style_cmds))
    return t


# ─── Build Document ───
OUTPUT_PDF = '/home/z/my-project/download/Bulk_SMS_Platform_Technical_Architecture.pdf'

doc = TocDocTemplate(
    OUTPUT_PDF, pagesize=A4,
    leftMargin=LEFT_M, rightMargin=RIGHT_M,
    topMargin=TOP_M, bottomMargin=BOTTOM_M,
    title='Bulk SMS Platform Technical Architecture',
    author='Z.ai', subject='Technical Architecture for Bulk SMS Platform Rebuild'
)

story = []

# ─── TOC ───
story.append(Paragraph('<b>Table of Contents</b>', ParagraphStyle(
    name='TOCTitle', fontName='Times New Roman', fontSize=20, leading=26,
    textColor=TEXT_PRIMARY, spaceBefore=6, spaceAfter=12
)))
toc = TableOfContents()
toc.levelStyles = [style_toc_h1, style_toc_h2]
story.append(toc)
story.append(PageBreak())

# ═══════════════════════════════════════════════
# SECTION 1: EXECUTIVE SUMMARY
# ═══════════════════════════════════════════════
story.append(add_heading('<b>1. Executive Summary</b>', style_h1, 0))
story.append(Paragraph(
    'This document presents the comprehensive technical architecture for rebuilding a modern Bulk SMS platform that '
    'reuses the existing <b>sdasms_sdasms</b> MySQL database. The existing platform is a production-grade, multi-tenant '
    'SMS SaaS application built with Laravel (PHP) and hosted on cPanel, comprising <b>65 database tables</b> across '
    '13 functional modules. The new platform will be built using <b>Next.js</b> for the frontend and <b>Node.js</b> for '
    'the backend API layer, connecting to the same MySQL database to preserve all existing data, user accounts, campaigns, '
    'contacts, billing records, and SMS delivery history.',
    style_body
))
story.append(Paragraph(
    'The existing database supports a rich feature set including multi-channel messaging (SMS, Voice, MMS, WhatsApp, Viber, OTP), '
    'campaign scheduling with recurring automations, two-way chat conversations, India DLT compliance, role-based access control, '
    'subscription-based billing with tiered pricing, sender ID management, contact segmentation, and comprehensive delivery '
    'reporting. The new platform must maintain full compatibility with all 65 tables while delivering a significantly improved '
    'user experience through a modern, responsive web interface built with Next.js and React Server Components.',
    style_body
))
story.append(Paragraph(
    'The recommended architecture follows a <b>middleware API pattern</b>, where the new Next.js application communicates '
    'with the MySQL database through a Node.js API layer. This approach provides better security by eliminating direct '
    'database exposure, enables caching and rate limiting, and allows for incremental migration without disrupting the '
    'existing cPanel-hosted platform. Both platforms can operate simultaneously against the same database during the '
    'transition period, ensuring zero downtime for existing users.',
    style_body
))

# Key metrics callout
metrics_data = [
    [Paragraph('<b>Metric</b>', style_header_cell), Paragraph('<b>Value</b>', style_header_cell)],
    [Paragraph('Database Name', style_cell), Paragraph('sdasms_sdasms', style_cell_center)],
    [Paragraph('Total Tables', style_cell), Paragraph('65', style_cell_center)],
    [Paragraph('Existing Platform', style_cell), Paragraph('Laravel/PHP on cPanel', style_cell_center)],
    [Paragraph('New Frontend', style_cell), Paragraph('Next.js 15 (React)', style_cell_center)],
    [Paragraph('New Backend', style_cell), Paragraph('Node.js + Express/Fastify', style_cell_center)],
    [Paragraph('Database Engine', style_cell), Paragraph('MySQL 8.0+', style_cell_center)],
    [Paragraph('Messaging Channels', style_cell), Paragraph('SMS, Voice, MMS, WhatsApp, Viber, OTP', style_cell_center)],
    [Paragraph('Compliance', style_cell), Paragraph('India DLT (TRAI)', style_cell_center)],
]
story.append(Spacer(1, 12))
t = make_table(metrics_data, [AVAIL_W * 0.5, AVAIL_W * 0.5])
story.append(t)
story.append(Paragraph('<b>Table 1.</b> Project Overview Metrics', style_caption))

# ═══════════════════════════════════════════════
# SECTION 2: EXISTING DATABASE ANALYSIS
# ═══════════════════════════════════════════════
story.append(Spacer(1, 18))
story.append(add_heading('<b>2. Existing Database Analysis</b>', style_h1, 0))
story.append(Paragraph(
    'The existing database follows a consistent Laravel convention with all tables prefixed by <b>cg_</b> (likely standing '
    'for "CommGateway" or the commercial product name). Every table includes an auto-incrementing <b>bigint primary key</b>, '
    'a <b>char(36) UUID field</b> named <b>uid</b> for external references, and automatic <b>created_at/updated_at</b> '
    'timestamp columns. This consistent pattern greatly simplifies the task of building a new application layer, as the '
    'data model is well-structured and predictable across all modules.',
    style_body
))

# 2.1 Technology Detection
story.append(add_heading('<b>2.1 Detected Technology Stack</b>', style_h2, 1))
story.append(Paragraph(
    'Several indicators in the database schema reveal the underlying technology choices of the existing platform. '
    'The presence of a <b>cg_migrations</b> table storing Laravel migration file names and batch numbers confirms '
    'the use of the Laravel PHP framework. The <b>cg_jobs</b>, <b>cg_job_batches</b>, and <b>cg_failed_jobs</b> '
    'tables are the standard Laravel Queue infrastructure for background job processing. The <b>cg_personal_access_tokens</b> '
    'table follows the exact schema of Laravel Sanctum, the official Laravel API authentication package, indicating that '
    'the existing platform already provides REST API access for external integrations.',
    style_body
))

tech_data = [
    [Paragraph('<b>Evidence</b>', style_header_cell), Paragraph('<b>Technology</b>', style_header_cell), Paragraph('<b>Implication</b>', style_header_cell)],
    [Paragraph('cg_migrations table', style_cell), Paragraph('Laravel Framework', style_cell), Paragraph('PHP backend with Eloquent ORM', style_cell)],
    [Paragraph('cg_jobs, cg_job_batches', style_cell), Paragraph('Laravel Queue', style_cell), Paragraph('Background job processing for bulk SMS', style_cell)],
    [Paragraph('cg_personal_access_tokens', style_cell), Paragraph('Laravel Sanctum', style_cell), Paragraph('Existing REST API with token auth', style_cell)],
    [Paragraph('uid char(36) on every table', style_cell), Paragraph('UUID pattern', style_cell), Paragraph('Laravel Str::uuid() for public IDs', style_cell)],
    [Paragraph('dlt_template_id, dlt_entity_id', style_cell), Paragraph('India DLT', style_cell), Paragraph('TRAI regulatory compliance built-in', style_cell)],
    [Paragraph('Multi-channel fields', style_cell), Paragraph('Omnichannel', style_cell), Paragraph('SMS, Voice, MMS, WhatsApp, Viber, OTP', style_cell)],
]
story.append(Spacer(1, 10))
t = make_table(tech_data, [AVAIL_W * 0.25, AVAIL_W * 0.30, AVAIL_W * 0.45])
story.append(t)
story.append(Paragraph('<b>Table 2.</b> Technology Stack Detection from Database Schema', style_caption))

# 2.2 Database Module Overview
story.append(Spacer(1, 12))
story.append(add_heading('<b>2.2 Database Module Overview</b>', style_h2, 1))
story.append(Paragraph(
    'The 65 tables are organized into 13 functional modules, each serving a distinct business capability. Understanding '
    'these modules is critical for the new platform development, as each module maps to a specific set of API endpoints, '
    'UI pages, and business logic components. The following table provides a complete inventory of all modules with their '
    'table counts and primary business functions.',
    style_body
))

modules_data = [
    [Paragraph('<b>Module</b>', style_header_cell), Paragraph('<b>Tables</b>', style_header_cell), Paragraph('<b>Key Tables</b>', style_header_cell)],
    [Paragraph('Users and Auth', style_cell), Paragraph('5', style_cell_center), Paragraph('cg_users, cg_roles, cg_role_user, cg_permissions, cg_password_resets', style_cell)],
    [Paragraph('SMS Campaigns', style_cell), Paragraph('5', style_cell_center), Paragraph('cg_campaigns, cg_campaigns_lists, cg_campaigns_senderids, cg_automations, cg_file_campaign_data', style_cell)],
    [Paragraph('Contacts Management', style_cell), Paragraph('7', style_cell_center), Paragraph('cg_contacts, cg_contact_groups, cg_contact_group_fields, cg_contacts_custom_field', style_cell)],
    [Paragraph('Two-Way SMS/Chat', style_cell), Paragraph('2', style_cell_center), Paragraph('cg_chat_boxes, cg_chat_box_messages', style_cell)],
    [Paragraph('Reporting and Tracking', style_cell), Paragraph('3', style_cell_center), Paragraph('cg_reports, cg_tracking_logs, cg_schedule_messages', style_cell)],
    [Paragraph('Sending Servers', style_cell), Paragraph('4', style_cell_center), Paragraph('cg_sending_servers, cg_custom_sending_servers, cg_sending_server_based_pricing_plans', style_cell)],
    [Paragraph('Sender IDs', style_cell), Paragraph('2', style_cell_center), Paragraph('cg_senderid, cg_senderid_plans', style_cell)],
    [Paragraph('Billing and Subscriptions', style_cell), Paragraph('9', style_cell_center), Paragraph('cg_plans, cg_subscriptions, cg_invoices, cg_payment_methods, cg_customer_based_pricing_plans', style_cell)],
    [Paragraph('Templates', style_cell), Paragraph('3', style_cell_center), Paragraph('cg_templates, cg_template_tags, cg_email_templates', style_cell)],
    [Paragraph('Keywords and Numbers', style_cell), Paragraph('2', style_cell_center), Paragraph('cg_keywords, cg_phone_numbers', style_cell)],
    [Paragraph('Segmentation', style_cell), Paragraph('2', style_cell_center), Paragraph('cg_segments, cg_segment_conditions', style_cell)],
    [Paragraph('Job Queue System', style_cell), Paragraph('5', style_cell_center), Paragraph('cg_jobs, cg_job_batches, cg_job_monitors, cg_failed_jobs, cg_import_job_histories', style_cell)],
    [Paragraph('System and Utilities', style_cell), Paragraph('16', style_cell_center), Paragraph('cg_app_config, cg_countries, cg_currencies, cg_languages, cg_spam_word, cg_blacklists, cg_plugins, cg_notifications', style_cell)],
]
story.append(Spacer(1, 10))
t = make_table(modules_data, [AVAIL_W * 0.22, AVAIL_W * 0.08, AVAIL_W * 0.70])
story.append(t)
story.append(Paragraph('<b>Table 3.</b> Complete Database Module Inventory (65 Tables)', style_caption))

# 2.3 System Architecture Diagram
story.append(Spacer(1, 12))
story.append(add_heading('<b>2.3 System Architecture Overview</b>', style_h2, 1))
story.append(Paragraph(
    'The proposed system architecture follows a three-tier design pattern with a clear separation between the presentation '
    'layer, the application logic layer, and the data layer. The existing cPanel-hosted Laravel application and the new '
    'Next.js platform will share the same MySQL database during the transition period, with both writing to and reading '
    'from the identical set of 65 tables. A Redis instance handles job queuing and real-time WebSocket communication for '
    'the two-way chat feature, while multiple SMS gateway integrations connect through configurable sending server definitions.',
    style_body
))

img_path = '/home/z/my-project/download/system_architecture.png'
if os.path.exists(img_path):
    img = Image(img_path, width=AVAIL_W, height=AVAIL_W * 0.67)
    img.hAlign = 'CENTER'
    story.append(Spacer(1, 10))
    story.append(img)
    story.append(Paragraph('<b>Figure 1.</b> System Architecture Overview', style_caption))

# 2.4 Database Module Relationship Diagram
story.append(Spacer(1, 12))
story.append(add_heading('<b>2.4 Database Module Relationships</b>', style_h2, 1))
story.append(Paragraph(
    'The 13 database modules are interconnected through foreign key relationships centered on the <b>cg_users</b> table, '
    'which serves as the central entity linking almost every module. Each user can own campaigns, contacts, chat conversations, '
    'sender IDs, phone numbers, and subscriptions. The campaign module connects to contacts through many-to-many relationships, '
    'and the tracking module records delivery outcomes for every message sent through any campaign or automation. The billing '
    'module manages subscription lifecycles and invoice generation, while the sending server module provides the gateway '
    'abstraction layer that routes messages through different providers based on country-specific pricing and availability.',
    style_body
))

img_path2 = '/home/z/my-project/download/db_module_diagram.png'
if os.path.exists(img_path2):
    img2 = Image(img_path2, width=AVAIL_W, height=AVAIL_W * 0.75)
    img2.hAlign = 'CENTER'
    story.append(Spacer(1, 10))
    story.append(img2)
    story.append(Paragraph('<b>Figure 2.</b> Database Module Relationship Diagram', style_caption))

# ═══════════════════════════════════════════════
# SECTION 3: CORE TABLE ANALYSIS
# ═══════════════════════════════════════════════
story.append(Spacer(1, 18))
story.append(add_heading('<b>3. Core Table Analysis</b>', style_h1, 0))
story.append(Paragraph(
    'This section provides detailed analysis of the most critical tables in the database. These tables form the backbone '
    'of the SMS platform and must be fully understood before building the new application layer. Each subsection covers '
    'the table structure, key columns, business logic implications, and integration requirements for the new platform.',
    style_body
))

# 3.1 Users Table
story.append(add_heading('<b>3.1 User Management (cg_users)</b>', style_h2, 1))
story.append(Paragraph(
    'The <b>cg_users</b> table is the central entity of the entire platform. It supports a multi-tenant architecture '
    'through a <b>parent_id</b> column that enables hierarchical user relationships (admin creates sub-accounts, resellers '
    'create customer accounts, etc.). The table includes both <b>is_admin</b> and <b>is_customer</b> boolean flags to '
    'distinguish between system administrators and paying customers, while the <b>cg_roles</b> and <b>cg_permissions</b> '
    'tables provide a more granular role-based access control system. The <b>api_token</b> column stores a unique token '
    'for each user, enabling direct API access without requiring full OAuth flows. Two-factor authentication is supported '
    'through <b>two_factor</b>, <b>two_factor_code</b>, <b>two_factor_expires_at</b>, and <b>two_factor_backup_code</b> columns. '
    'DLT compliance fields (<b>dlt_entity_id</b>, <b>dlt_telemarketer_id</b>) indicate India-specific regulatory requirements, '
    'while the <b>sms_unit</b> column tracks the user\'s remaining SMS credit balance.',
    style_body
))

users_cols = [
    [Paragraph('<b>Column</b>', style_header_cell), Paragraph('<b>Type</b>', style_header_cell), Paragraph('<b>Purpose</b>', style_header_cell)],
    [Paragraph('id, uid', style_cell), Paragraph('bigint, char36', style_cell_center), Paragraph('Primary key and public UUID', style_cell)],
    [Paragraph('parent_id', style_cell), Paragraph('bigint', style_cell_center), Paragraph('Multi-tenant hierarchy (admin/reseller/customer)', style_cell)],
    [Paragraph('email, password', style_cell), Paragraph('varchar191', style_cell_center), Paragraph('Authentication credentials', style_cell)],
    [Paragraph('is_admin, is_customer', style_cell), Paragraph('tinyint', style_cell_center), Paragraph('Role flags for access control', style_cell)],
    [Paragraph('api_token', style_cell), Paragraph('varchar191', style_cell_center), Paragraph('API authentication token', style_cell)],
    [Paragraph('sms_unit', style_cell), Paragraph('varchar191', style_cell_center), Paragraph('Remaining SMS credit balance', style_cell)],
    [Paragraph('two_factor', style_cell), Paragraph('tinyint, int, datetime', style_cell_center), Paragraph('Two-factor authentication support', style_cell)],
    [Paragraph('dlt_entity_id', style_cell), Paragraph('varchar191', style_cell_center), Paragraph('India DLT regulatory compliance', style_cell)],
    [Paragraph('webhook_url', style_cell), Paragraph('varchar191', style_cell_center), Paragraph('Delivery receipt webhook endpoint', style_cell)],
    [Paragraph('api_sending_server', style_cell), Paragraph('bigint', style_cell_center), Paragraph('Default gateway for API requests', style_cell)],
]
story.append(Spacer(1, 10))
t = make_table(users_cols, [AVAIL_W * 0.22, AVAIL_W * 0.23, AVAIL_W * 0.55])
story.append(t)
story.append(Paragraph('<b>Table 4.</b> cg_users Key Columns', style_caption))

# 3.2 Campaigns
story.append(Spacer(1, 12))
story.append(add_heading('<b>3.2 SMS Campaigns (cg_campaigns)</b>', style_h2, 1))
story.append(Paragraph(
    'The <b>cg_campaigns</b> table is the heart of the SMS platform, supporting both one-time and recurring campaign '
    'scheduling with sophisticated targeting capabilities. Each campaign can be associated with multiple contact lists '
    'through the <b>cg_campaigns_lists</b> junction table, and can use multiple sender IDs through <b>cg_campaigns_senderids</b>. '
    'The scheduling system supports <b>onetime</b> and <b>recurring</b> schedule types, with recurring campaigns configurable '
    'through <b>frequency_cycle</b>, <b>frequency_amount</b>, and <b>frequency_unit</b> columns. The <b>running_pid</b> column '
    'tracks the background process ID for active campaigns, enabling process management and monitoring. The <b>dlt_template_id</b> '
    'column links each campaign to an approved DLT template for regulatory compliance, and <b>skip_failed_message</b> controls '
    'whether failed recipients should be retried in subsequent batches.',
    style_body
))

# 3.3 Sending Servers
story.append(Spacer(1, 12))
story.append(add_heading('<b>3.3 Sending Servers (cg_sending_servers)</b>', style_h2, 1))
story.append(Paragraph(
    'The <b>cg_sending_servers</b> table provides a comprehensive abstraction layer for SMS gateway connectivity, supporting '
    'multiple protocols including HTTP API, SMPP, WhatsApp, Viber, and OTP-specific gateways. Each sending server configuration '
    'stores credentials across numerous authentication schemes (API key/secret, OAuth tokens, SMPP username/password, AWS access '
    'keys, and more) to accommodate the diverse authentication mechanisms used by different SMS providers. The table includes '
    'rate limiting configuration through <b>sms_per_request</b>, <b>quota_value</b>, <b>quota_base</b>, and <b>quota_unit</b> columns, '
    'enabling precise control over message throughput per gateway. The <b>custom</b> flag indicates whether this server uses the '
    'standard integration or a custom HTTP configuration defined in <b>cg_custom_sending_servers</b>, which maps request parameters '
    'to the specific API format required by each provider.',
    style_body
))

# 3.4 Contacts
story.append(Spacer(1, 12))
story.append(add_heading('<b>3.4 Contacts and Groups</b>', style_h2, 1))
story.append(Paragraph(
    'The contacts module provides a sophisticated contact management system built around <b>cg_contact_groups</b> (also referred '
    'to as contact lists). Each contact group supports custom fields through <b>cg_contact_group_fields</b>, which defines field '
    'types, labels, tags, and validation rules. Individual contacts in <b>cg_contacts</b> are linked to both a customer (owner) '
    'and a group (membership), with custom field values stored in <b>cg_contacts_custom_field</b>. The opt-in/opt-out system '
    'uses dedicated keyword tables (<b>cg_contact_groups_optin_keywords</b> and <b>cg_contact_groups_optout_keywords</b>) to '
    'automatically manage group subscriptions via SMS keywords. Contact groups also support automated welcome messages, unsubscribe '
    'notifications, and signup confirmations, making them function as self-service subscription lists for end recipients.',
    style_body
))

# 3.5 Billing
story.append(Spacer(1, 12))
story.append(add_heading('<b>3.5 Billing and Subscriptions</b>', style_h2, 1))
story.append(Paragraph(
    'The billing module implements a complete subscription-based monetization system. The <b>cg_plans</b> table defines pricing '
    'plans with configurable billing cycles, while <b>cg_plans_coverage_countries</b> maps per-country SMS rates and gateway '
    'assignments to each plan. Tiered credit pricing through <b>cg_plan_sending_credit_prices</b> enables volume-based discounts '
    '(e.g., first 1000 credits at $0.01 each, next 5000 at $0.008). The <b>cg_subscriptions</b> table tracks active subscriptions '
    'with status workflow (new, pending, active, ended, renew), while <b>cg_subscription_transactions</b> records payment history. '
    'The <b>cg_customer_based_pricing_plans</b> table allows custom pricing overrides per customer, enabling enterprise or '
    'reseller-specific rate agreements. Invoices are managed through <b>cg_invoices</b> with support for tax calculation, multiple '
    'payment methods, and transaction tracking.',
    style_body
))

# ═══════════════════════════════════════════════
# SECTION 4: PROPOSED TECH STACK
# ═══════════════════════════════════════════════
story.append(Spacer(1, 18))
story.append(add_heading('<b>4. Proposed Technology Stack</b>', style_h1, 0))
story.append(Paragraph(
    'The new platform will be built with a modern technology stack optimized for performance, developer productivity, and '
    'long-term maintainability. The choice of Next.js for the frontend and Node.js for the backend provides a unified '
    'TypeScript development experience across the entire application, reducing context switching and enabling code sharing '
    'between client and server. The following table details each technology choice and its justification in the context of '
    'building a bulk SMS platform that must integrate with an existing MySQL database.',
    style_body
))

stack_data = [
    [Paragraph('<b>Layer</b>', style_header_cell), Paragraph('<b>Technology</b>', style_header_cell), Paragraph('<b>Justification</b>', style_header_cell)],
    [Paragraph('Frontend', style_cell), Paragraph('Next.js 15 (React)', style_cell), Paragraph('SSR, file-based routing, React Server Components, excellent DX', style_cell)],
    [Paragraph('UI Components', style_cell), Paragraph('shadcn/ui + Tailwind CSS', style_cell), Paragraph('Accessible, customizable, consistent design system', style_cell)],
    [Paragraph('Backend API', style_cell), Paragraph('Node.js + Fastify', style_cell), Paragraph('Fast, schema-based validation, plugin ecosystem, TypeScript native', style_cell)],
    [Paragraph('Database', style_cell), Paragraph('MySQL 8.0 (existing)', style_cell), Paragraph('Reuse existing sdasms_sdasms database without migration', style_cell)],
    [Paragraph('ORM', style_cell), Paragraph('Prisma or Drizzle', style_cell), Paragraph('Type-safe database access, migration management', style_cell)],
    [Paragraph('Queue/Jobs', style_cell), Paragraph('Redis + BullMQ', style_cell), Paragraph('Background SMS processing, retry logic, job monitoring', style_cell)],
    [Paragraph('Real-time Chat', style_cell), Paragraph('Socket.io / WebSocket', style_cell), Paragraph('Two-way SMS chat with live message delivery', style_cell)],
    [Paragraph('Authentication', style_cell), Paragraph('NextAuth.js / JWT', style_cell), Paragraph('Compatible with existing cg_users password hashing', style_cell)],
    [Paragraph('State Management', style_cell), Paragraph('Zustand / React Query', style_cell), Paragraph('Lightweight server state caching and client state', style_cell)],
    [Paragraph('Deployment', style_cell), Paragraph('VPS / Docker', style_cell), Paragraph('Cost-effective, full control, easy database connectivity', style_cell)],
    [Paragraph('Monitoring', style_cell), Paragraph('Sentry + Prometheus', style_cell), Paragraph('Error tracking, performance monitoring, alerting', style_cell)],
]
story.append(Spacer(1, 10))
t = make_table(stack_data, [AVAIL_W * 0.16, AVAIL_W * 0.28, AVAIL_W * 0.56])
story.append(t)
story.append(Paragraph('<b>Table 5.</b> Proposed Technology Stack', style_caption))

# ═══════════════════════════════════════════════
# SECTION 5: API ARCHITECTURE
# ═══════════════════════════════════════════════
story.append(Spacer(1, 18))
story.append(add_heading('<b>5. API Architecture</b>', style_h1, 0))
story.append(Paragraph(
    'The REST API layer serves as the critical bridge between the Next.js frontend and the MySQL database. It must expose '
    'clean, well-documented endpoints that map directly to the existing database operations while maintaining backward '
    'compatibility with any existing API consumers using the current Laravel Sanctum tokens. The API follows RESTful conventions '
    'with consistent response formats, pagination, filtering, and error handling across all endpoints.',
    style_body
))

img_path3 = '/home/z/my-project/download/api_architecture.png'
if os.path.exists(img_path3):
    img3 = Image(img_path3, width=AVAIL_W, height=AVAIL_W * 0.58)
    img3.hAlign = 'CENTER'
    story.append(Spacer(1, 10))
    story.append(img3)
    story.append(Paragraph('<b>Figure 3.</b> API Endpoint Architecture', style_caption))

# 5.1 API Endpoints
story.append(Spacer(1, 12))
story.append(add_heading('<b>5.1 Core API Endpoints</b>', style_h2, 1))
story.append(Paragraph(
    'The following table lists the primary API endpoint groups that the backend must implement. Each group corresponds to '
    'a specific database module and provides full CRUD operations along with module-specific actions. All endpoints require '
    'authentication except where explicitly marked as public.',
    style_body
))

api_data = [
    [Paragraph('<b>Endpoint Group</b>', style_header_cell), Paragraph('<b>Key Operations</b>', style_header_cell), Paragraph('<b>Database Tables</b>', style_header_cell)],
    [Paragraph('/api/v1/auth/*', style_cell), Paragraph('Login, register, logout, 2FA setup, password reset, token refresh', style_cell), Paragraph('cg_users, cg_password_resets, cg_roles', style_cell)],
    [Paragraph('/api/v1/campaigns/*', style_cell), Paragraph('CRUD, create/send/schedule, attach lists and sender IDs, pause/cancel', style_cell), Paragraph('cg_campaigns, cg_campaigns_lists, cg_campaigns_senderids, cg_file_campaign_data', style_cell)],
    [Paragraph('/api/v1/contacts/*', style_cell), Paragraph('CRUD groups and contacts, custom fields, import CSV, opt-in/out keywords', style_cell), Paragraph('cg_contacts, cg_contact_groups, cg_contact_group_fields, cg_contacts_custom_field', style_cell)],
    [Paragraph('/api/v1/chat/*', style_cell), Paragraph('List conversations, get/send messages, pin conversations, real-time via WS', style_cell), Paragraph('cg_chat_boxes, cg_chat_box_messages', style_cell)],
    [Paragraph('/api/v1/reports/*', style_cell), Paragraph('Delivery reports, campaign analytics, tracking logs, export CSV', style_cell), Paragraph('cg_reports, cg_tracking_logs', style_cell)],
    [Paragraph('/api/v1/billing/*', style_cell), Paragraph('List plans, subscribe, view invoices, transaction history, payment', style_cell), Paragraph('cg_plans, cg_subscriptions, cg_invoices, cg_payment_methods', style_cell)],
    [Paragraph('/api/v1/servers/*', style_cell), Paragraph('CRUD sending servers, test connection, configure custom params', style_cell), Paragraph('cg_sending_servers, cg_custom_sending_servers', style_cell)],
    [Paragraph('/api/v1/templates/*', style_cell), Paragraph('CRUD SMS templates, DLT template management, tag variables', style_cell), Paragraph('cg_templates, cg_template_tags', style_cell)],
    [Paragraph('/api/v1/senderids/*', style_cell), Paragraph('CRUD sender IDs, submit for approval, billing status', style_cell), Paragraph('cg_senderid, cg_senderid_plans', style_cell)],
    [Paragraph('/api/v1/admin/*', style_cell), Paragraph('User management, system settings, announcements, roles and permissions', style_cell), Paragraph('cg_users, cg_app_config, cg_roles, cg_permissions', style_cell)],
    [Paragraph('/api/v1/webhooks/*', style_cell), Paragraph('Delivery receipt handler, inbound SMS handler, webhook configuration', style_cell), Paragraph('cg_reports, cg_chat_boxes', style_cell)],
]
story.append(Spacer(1, 10))
t = make_table(api_data, [AVAIL_W * 0.22, AVAIL_W * 0.40, AVAIL_W * 0.38])
story.append(t)
story.append(Paragraph('<b>Table 6.</b> Core API Endpoint Groups', style_caption))

# ═══════════════════════════════════════════════
# SECTION 6: MODULE DESIGN
# ═══════════════════════════════════════════════
story.append(Spacer(1, 18))
story.append(add_heading('<b>6. Frontend Module Design</b>', style_h1, 0))
story.append(Paragraph(
    'The Next.js frontend will be organized into modular pages that map directly to the database modules identified in the '
    'analysis. Each module consists of a main listing page, detail/edit pages, and supporting components. The application '
    'will use a sidebar navigation layout with module-level access control based on the user\'s role and permissions stored '
    'in the <b>cg_roles</b> and <b>cg_permissions</b> tables. The following table outlines the planned page structure for '
    'each module, ensuring comprehensive coverage of all platform functionality.',
    style_body
))

pages_data = [
    [Paragraph('<b>Module</b>', style_header_cell), Paragraph('<b>Pages</b>', style_header_cell), Paragraph('<b>Key Features</b>', style_header_cell)],
    [Paragraph('Dashboard', style_cell), Paragraph('home / dashboard', style_cell), Paragraph('SMS usage stats, credit balance, recent campaigns, delivery rates, quick actions', style_cell)],
    [Paragraph('Campaigns', style_cell), Paragraph('campaigns', style_cell), Paragraph('Create, schedule, send campaigns; attach contact lists; select sender IDs; DLT template picker', style_cell)],
    [Paragraph('Contacts', style_cell), Paragraph('contacts', style_cell), Paragraph('Contact groups, custom fields, CSV import, opt-in/opt-out keywords, segment builder', style_cell)],
    [Paragraph('Chat', style_cell), Paragraph('chat', style_cell), Paragraph('Two-way SMS conversations, real-time messaging, pinned chats, media support', style_cell)],
    [Paragraph('Reports', style_cell), Paragraph('reports', style_cell), Paragraph('Delivery analytics, campaign performance, export to CSV/PDF, date range filters', style_cell)],
    [Paragraph('Templates', style_cell), Paragraph('templates', style_cell), Paragraph('SMS template CRUD, variable tags, DLT template linking, approval status', style_cell)],
    [Paragraph('Sender IDs', style_cell), Paragraph('sender-ids', style_cell), Paragraph('Apply for sender IDs, track approval, billing info, entity documents', style_cell)],
    [Paragraph('Billing', style_cell), Paragraph('billing', style_cell), Paragraph('View plans, subscribe, pay invoices, view transaction history', style_cell)],
    [Paragraph('API Keys', style_cell), Paragraph('api-keys', style_cell), Paragraph('Generate/regenerate API tokens, view usage logs, set webhook URL', style_cell)],
    [Paragraph('Settings', style_cell), Paragraph('settings', style_cell), Paragraph('Profile, 2FA, timezone, language, notification preferences', style_cell)],
    [Paragraph('Admin Panel', style_cell), Paragraph('admin', style_cell), Paragraph('User management, system config, sending servers, payment methods, announcements', style_cell)],
]
story.append(Spacer(1, 10))
t = make_table(pages_data, [AVAIL_W * 0.15, AVAIL_W * 0.18, AVAIL_W * 0.67])
story.append(t)
story.append(Paragraph('<b>Table 7.</b> Frontend Page Structure by Module', style_caption))

# ═══════════════════════════════════════════════
# SECTION 7: DATABASE ACCESS STRATEGY
# ═══════════════════════════════════════════════
story.append(Spacer(1, 18))
story.append(add_heading('<b>7. Database Access Strategy</b>', style_h1, 0))
story.append(Paragraph(
    'Choosing the right database access strategy is one of the most critical decisions for this project, as it directly '
    'impacts security, performance, and the ability to run both platforms simultaneously during migration. Three approaches '
    'were evaluated, with the API middleware approach recommended as the optimal solution.',
    style_body
))

story.append(add_heading('<b>7.1 Recommended: API Middleware Layer</b>', style_h2, 1))
story.append(Paragraph(
    'The recommended approach places a Node.js API layer between the Next.js frontend and the MySQL database. The API layer '
    'handles all database operations including CRUD operations, complex queries with joins, transaction management, and data '
    'validation. This provides several critical advantages: the database credentials are never exposed to the frontend, rate '
    'limiting can be applied at the API level to prevent abuse, caching can be implemented for frequently accessed data like '
    'user settings and contact lists, and the API can maintain backward compatibility with any existing Laravel Sanctum tokens '
    'that external integrations may be using. The API layer can also implement database connection pooling, query optimization, '
    'and read replicas for reporting-heavy operations without changing the frontend code.',
    style_body
))

strategy_data = [
    [Paragraph('<b>Criterion</b>', style_header_cell), Paragraph('<b>Direct Connection</b>', style_header_cell), Paragraph('<b>API Middleware (Recommended)</b>', style_header_cell)],
    [Paragraph('Security', style_cell), Paragraph('DB credentials exposed', style_cell), Paragraph('Credentials isolated in backend', style_cell)],
    [Paragraph('Performance', style_cell), Paragraph('Low latency, direct', style_cell), Paragraph('Slight overhead, cacheable', style_cell)],
    [Paragraph('Compatibility', style_cell), Paragraph('Risk of schema conflicts', style_cell), Paragraph('Controlled data access layer', style_cell)],
    [Paragraph('Rate Limiting', style_cell), Paragraph('Not possible', style_cell), Paragraph('Built-in at API level', style_cell)],
    [Paragraph('Concurrent Writes', style_cell), Paragraph('High risk of conflicts', style_cell), Paragraph('Managed through transactions', style_cell)],
    [Paragraph('Migration Path', style_cell), Paragraph('Difficult to change later', style_cell), Paragraph('Easy to evolve independently', style_cell)],
    [Paragraph('Old Platform Support', style_cell), Paragraph('Both write directly', style_cell), Paragraph('Controlled coexistence', style_cell)],
]
story.append(Spacer(1, 10))
t = make_table(strategy_data, [AVAIL_W * 0.20, AVAIL_W * 0.35, AVAIL_W * 0.45])
story.append(t)
story.append(Paragraph('<b>Table 8.</b> Database Access Strategy Comparison', style_caption))

# ═══════════════════════════════════════════════
# SECTION 8: MIGRATION STRATEGY
# ═══════════════════════════════════════════════
story.append(Spacer(1, 18))
story.append(add_heading('<b>8. Migration Strategy</b>', style_h1, 0))
story.append(Paragraph(
    'The migration from the existing Laravel platform to the new Next.js application must be executed carefully to ensure '
    'zero data loss and minimal service disruption. The strategy follows a phased approach where both platforms run '
    'simultaneously against the same database, with users gradually migrated to the new interface. The existing Laravel '
    'application continues to function normally throughout the transition, ensuring business continuity.',
    style_body
))

story.append(add_heading('<b>8.1 Phase 1: Foundation (Weeks 1-3)</b>', style_h2, 1))
story.append(Paragraph(
    'The first phase focuses on establishing the technical foundation. This includes setting up the Node.js backend with '
    'Prisma ORM connected to the existing MySQL database, implementing authentication that reads from and validates against '
    'the <b>cg_users</b> table (using bcrypt password verification compatible with Laravel\'s hashing), building the basic '
    'Next.js application shell with sidebar navigation and layout components, and deploying the staging environment. The '
    'critical deliverable of this phase is a working authentication flow that can log users into the new platform using '
    'their existing credentials, proving that database connectivity and compatibility are established.',
    style_body
))

story.append(add_heading('<b>8.2 Phase 2: Core Features (Weeks 4-8)</b>', style_h2, 1))
story.append(Paragraph(
    'The second phase builds the core business modules: campaigns, contacts, and reporting. This includes the campaign '
    'composer with contact list selection, sender ID assignment, message template usage, and scheduling capabilities. The '
    'contact management module must support CSV import (matching the existing <b>cg_csv_data</b> pattern), custom field '
    'management, and group-based opt-in/opt-out keywords. The reporting module should provide delivery analytics with charts '
    'and export capabilities, reading from the <b>cg_reports</b> and <b>cg_tracking_logs</b> tables. The two-way chat '
    'module with WebSocket integration should also be implemented in this phase.',
    style_body
))

story.append(add_heading('<b>8.3 Phase 3: Billing and Admin (Weeks 9-11)</b>', style_h2, 1))
story.append(Paragraph(
    'The third phase implements the billing module (plans, subscriptions, invoices, payment processing), the admin panel '
    '(user management, system settings, sending server configuration), and remaining features like sender ID management, '
    'keyword handling, phone number provisioning, and the automation engine. The admin panel must provide full control over '
    'all platform settings stored in <b>cg_app_config</b>, user role management through <b>cg_roles</b> and <b>cg_permissions</b>, '
    'and sending server configuration through <b>cg_sending_servers</b> and <b>cg_custom_sending_servers</b>.',
    style_body
))

story.append(add_heading('<b>8.4 Phase 4: Testing and Launch (Weeks 12-14)</b>', style_h2, 1))
story.append(Paragraph(
    'The final phase focuses on comprehensive testing, performance optimization, and production deployment. This includes '
    'end-to-end testing of all workflows (campaign creation to delivery report verification), load testing for bulk SMS '
    'sending operations, security auditing of the API layer, and setting up monitoring and alerting. User migration is '
    'executed gradually, starting with admin users, then power users, and finally all remaining users. The existing Laravel '
    'platform remains available as a fallback throughout the launch period, with a final cutover planned after 30 days of '
    'stable operation of the new platform.',
    style_body
))

# ═══════════════════════════════════════════════
# SECTION 9: SECURITY CONSIDERATIONS
# ═══════════════════════════════════════════════
story.append(Spacer(1, 18))
story.append(add_heading('<b>9. Security Considerations</b>', style_h1, 0))
story.append(Paragraph(
    'Running two applications against the same database introduces specific security challenges that must be addressed '
    'proactively. The following measures are essential for maintaining data integrity and preventing unauthorized access.',
    style_body
))

security_data = [
    [Paragraph('<b>Concern</b>', style_header_cell), Paragraph('<b>Risk</b>', style_header_cell), Paragraph('<b>Mitigation</b>', style_header_cell)],
    [Paragraph('Concurrent Writes', style_cell), Paragraph('Data corruption when both platforms modify same records', style_cell), Paragraph('Database transactions with row-level locking, optimistic concurrency control', style_cell)],
    [Paragraph('Authentication', style_cell), Paragraph('Password hash compatibility between Laravel and Node.js', style_cell), Paragraph('Use bcrypt with matching cost factor (Laravel default: 10 rounds)', style_cell)],
    [Paragraph('API Tokens', style_cell), Paragraph('Existing Sanctum tokens must work with new API', style_cell), Paragraph('Validate tokens against cg_personal_access_tokens table', style_cell)],
    [Paragraph('SQL Injection', style_cell), Paragraph('Direct database access increases attack surface', style_cell), Paragraph('Use Prisma parameterized queries exclusively, never raw SQL', style_cell)],
    [Paragraph('Rate Limiting', style_cell), Paragraph('Abuse of SMS sending endpoints', style_cell), Paragraph('Per-user rate limits on campaign creation and API sending endpoints', style_cell)],
    [Paragraph('Data Privacy', style_cell), Paragraph('Contact numbers and messages contain PII', style_cell), Paragraph('Encryption at rest, field-level encryption for phone numbers', style_cell)],
    [Paragraph('Schema Changes', style_cell), Paragraph('New platform modifying schema breaks old platform', style_cell), Paragraph('Read-only constraint on new platform; all schema changes via migration scripts', style_cell)],
    [Paragraph('Webhook Security', style_cell), Paragraph('Fake delivery receipts from unauthorized sources', style_cell), Paragraph('HMAC signature verification on all webhook endpoints', style_cell)],
]
story.append(Spacer(1, 10))
t = make_table(security_data, [AVAIL_W * 0.16, AVAIL_W * 0.34, AVAIL_W * 0.50])
story.append(t)
story.append(Paragraph('<b>Table 9.</b> Security Considerations and Mitigations', style_caption))

# ═══════════════════════════════════════════════
# SECTION 10: DEVELOPMENT ROADMAP
# ═══════════════════════════════════════════════
story.append(Spacer(1, 18))
story.append(add_heading('<b>10. Development Roadmap</b>', style_h1, 0))
story.append(Paragraph(
    'The following roadmap provides a high-level timeline for the complete platform rebuild, organized into four phases '
    'over approximately 14 weeks. Each phase has clear deliverables and dependencies on the previous phase, ensuring a '
    'structured and predictable development process.',
    style_body
))

roadmap_data = [
    [Paragraph('<b>Phase</b>', style_header_cell), Paragraph('<b>Duration</b>', style_header_cell), Paragraph('<b>Key Deliverables</b>', style_header_cell), Paragraph('<b>Dependencies</b>', style_header_cell)],
    [Paragraph('Phase 1: Foundation', style_cell), Paragraph('Weeks 1-3', style_cell_center), Paragraph('Auth, DB connection, app shell, staging deploy', style_cell), Paragraph('MySQL remote access enabled', style_cell)],
    [Paragraph('Phase 2: Core Features', style_cell), Paragraph('Weeks 4-8', style_cell_center), Paragraph('Campaigns, contacts, chat, reporting modules', style_cell), Paragraph('Phase 1 auth working', style_cell)],
    [Paragraph('Phase 3: Billing and Admin', style_cell), Paragraph('Weeks 9-11', style_cell_center), Paragraph('Subscriptions, invoices, admin panel, automations', style_cell), Paragraph('Phase 2 core features', style_cell)],
    [Paragraph('Phase 4: Testing and Launch', style_cell), Paragraph('Weeks 12-14', style_cell_center), Paragraph('E2E testing, load testing, security audit, production deploy', style_cell), Paragraph('All phases complete', style_cell)],
]
story.append(Spacer(1, 10))
t = make_table(roadmap_data, [AVAIL_W * 0.20, AVAIL_W * 0.13, AVAIL_W * 0.40, AVAIL_W * 0.27])
story.append(t)
story.append(Paragraph('<b>Table 10.</b> Development Roadmap Summary', style_caption))

story.append(Spacer(1, 18))
story.append(Paragraph(
    'This architecture document provides the comprehensive blueprint needed to build the new Bulk SMS platform. The existing '
    'database of 65 tables is well-structured and follows consistent Laravel conventions, making it highly suitable for integration '
    'with a modern Next.js and Node.js application stack. By following the API middleware approach and the phased migration '
    'strategy outlined in this document, the transition can be executed with minimal risk and zero downtime for existing users.',
    style_body
))

# ─── Build ───
doc.multiBuild(story)
print(f"PDF generated: {OUTPUT_PDF}")
