/* ============================================
   LIBERTY PARK MANAGEMENT SERVICES
   Demo Engine — Shared Rendering Utilities
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // COUNTER ANIMATION
  // ============================================
  function animateCounter(element, target, options) {
    options = options || {};
    var duration = options.duration || 1200;
    var prefix = options.prefix || '';
    var suffix = options.suffix || '';
    var decimals = options.decimals || 0;
    var startTime = null;

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var value = easeOutExpo(progress) * target;
      if (decimals > 0) {
        element.textContent = prefix + value.toFixed(decimals) + suffix;
      } else {
        element.textContent = prefix + Math.floor(value).toLocaleString() + suffix;
      }
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // ============================================
  // BADGE HELPERS
  // ============================================
  function statusBadgeClass(status) {
    var map = {
      'pending': 'pending',
      'assigned': 'assigned',
      'in-progress': 'in-progress',
      'scheduled': 'scheduled',
      'completed': 'resolved',
      'resolved': 'resolved',
      'submitted': 'pending',
      'open': 'pending',
      'under-review': 'assigned',
      'approved': 'resolved',
      'approved-with-conditions': 'resolved',
      'denied': 'pending',
      'hearing-scheduled': 'scheduled',
      'fine-issued': 'pending'
    };
    return map[status] || 'assigned';
  }

  function statusLabel(status) {
    var map = {
      'pending': 'Pending',
      'assigned': 'Assigned',
      'in-progress': 'In Progress',
      'scheduled': 'Scheduled',
      'completed': 'Completed',
      'resolved': 'Resolved',
      'submitted': 'Submitted',
      'open': 'Open',
      'under-review': 'Under Review',
      'approved': 'Approved',
      'approved-with-conditions': 'Approved w/ Conditions',
      'denied': 'Denied',
      'hearing-scheduled': 'Hearing Scheduled',
      'fine-issued': 'Fine Issued'
    };
    return map[status] || status;
  }

  function priorityBadgeClass(priority) {
    var map = {
      'urgent': 'high',
      'high': 'high',
      'medium': 'medium',
      'low': 'low'
    };
    return map[priority] || 'low';
  }

  function priorityLabel(priority) {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  }

  // ============================================
  // TIME FORMATTING
  // ============================================
  function timeAgo(date) {
    if (typeof date === 'string') date = new Date(date);
    var seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    var intervals = {
      year: 31536000, month: 2592000, week: 604800,
      day: 86400, hour: 3600, minute: 60
    };
    for (var unit in intervals) {
      var interval = Math.floor(seconds / intervals[unit]);
      if (interval >= 1) {
        return interval + ' ' + unit + (interval > 1 ? 's' : '') + ' ago';
      }
    }
    return 'Just now';
  }

  // ============================================
  // RENDER: WORK ORDER KANBAN CARD
  // ============================================
  function renderWorkOrderCard(wo) {
    var priorityClass = priorityBadgeClass(wo.priority);
    return '<div class="kanban-card" data-wo-id="' + wo.id + '">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">' +
        '<span style="font-size:0.75rem;font-weight:600;color:var(--text-muted);">' + wo.id + '</span>' +
        '<span class="priority-badge ' + priorityClass + '">' + priorityLabel(wo.priority) + '</span>' +
      '</div>' +
      '<div style="font-size:0.875rem;font-weight:600;color:var(--text-dark);margin-bottom:0.375rem;">' + wo.title + '</div>' +
      '<div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.5rem;">' + wo.communityName + '</div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;">' +
        '<div style="display:flex;align-items:center;gap:0.375rem;">' +
          '<div class="avatar avatar-sm avatar-navy" style="width:24px;height:24px;font-size:0.625rem;">' + getInitials(wo.assignedTo) + '</div>' +
          '<span style="font-size:0.6875rem;color:var(--text-muted);">' + wo.assignedTo + '</span>' +
        '</div>' +
        '<span style="font-size:0.6875rem;color:var(--text-light);">' + timeAgo(wo.createdDate) + '</span>' +
      '</div>' +
    '</div>';
  }

  // ============================================
  // RENDER: WORK ORDER TABLE ROW
  // ============================================
  function renderWorkOrderRow(wo) {
    var priorityClass = priorityBadgeClass(wo.priority);
    var statusClass = statusBadgeClass(wo.status);
    return '<tr data-wo-id="' + wo.id + '">' +
      '<td style="font-weight:600;color:var(--text-dark);">' + wo.id + '</td>' +
      '<td>' + wo.communityName + '</td>' +
      '<td>' + wo.title + '</td>' +
      '<td><span class="priority-badge ' + priorityClass + '">' + priorityLabel(wo.priority) + '</span></td>' +
      '<td><span class="status-badge ' + statusClass + '">' + statusLabel(wo.status) + '</span></td>' +
      '<td>' + wo.assignedTo + '</td>' +
      '<td>' + LPMS.formatDate(wo.createdDate) + '</td>' +
    '</tr>';
  }

  // ============================================
  // RENDER: RESIDENT TABLE ROW
  // ============================================
  function renderResidentRow(r) {
    var statusClass = r.status === 'current' ? 'badge-success' : r.status === 'past-due' ? 'badge-warning' : 'badge-danger';
    var statusText = r.status === 'current' ? 'Current' : r.status === 'past-due' ? 'Past Due' : 'Delinquent';
    var balanceColor = r.balance > 0 ? 'var(--danger)' : 'var(--teal)';
    var balanceText = r.balance === 0 ? '$0.00' : '$' + r.balance.toFixed(2);
    return '<tr data-resident-id="' + r.id + '" data-searchable data-community="' + r.community + '" data-status="' + r.status + '">' +
      '<td>' +
        '<div style="display:flex;align-items:center;gap:0.75rem;">' +
          '<div class="avatar avatar-sm avatar-' + r.avatarColor + '">' + r.initials + '</div>' +
          '<div>' +
            '<div style="font-weight:600;color:var(--text-dark);">' + r.firstName + ' ' + r.lastName + '</div>' +
            '<div style="font-size:0.75rem;color:var(--text-muted);">' + r.email + '</div>' +
          '</div>' +
        '</div>' +
      '</td>' +
      '<td>' + r.address + '</td>' +
      '<td>' + r.communityName + '</td>' +
      '<td><span class="badge ' + statusClass + '">' + statusText + '</span></td>' +
      '<td style="color:' + balanceColor + ';font-weight:600;">' + balanceText + '</td>' +
      '<td>' + LPMS.formatDate(r.lastPayment) + '</td>' +
    '</tr>';
  }

  // ============================================
  // RENDER: ACTIVITY FEED ITEM
  // ============================================
  function renderActivityItem(item) {
    var iconMap = {
      'wrench': '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>',
      'dollar': '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
      'clipboard': '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
      'alert': '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      'file': '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
      'user': '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
    };
    var colorMap = {
      'navy': 'var(--navy)',
      'teal': 'var(--teal)',
      'gold': 'var(--gold)',
      'danger': 'var(--danger)'
    };
    var bgMap = {
      'navy': 'rgba(27,42,74,0.08)',
      'teal': 'rgba(46,125,111,0.1)',
      'gold': 'rgba(200,162,84,0.12)',
      'danger': 'rgba(192,57,43,0.1)'
    };

    return '<div class="activity-item">' +
      '<div style="width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:' + (bgMap[item.color] || bgMap.navy) + ';color:' + (colorMap[item.color] || colorMap.navy) + ';">' +
        (iconMap[item.icon] || iconMap.file) +
      '</div>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-size:0.8125rem;color:var(--text-dark);">' + item.text + '</div>' +
        '<div style="font-size:0.75rem;color:var(--text-muted);">' + item.detail + '</div>' +
      '</div>' +
      '<div style="font-size:0.6875rem;color:var(--text-light);white-space:nowrap;flex-shrink:0;">' + timeAgo(item.time) + '</div>' +
    '</div>';
  }

  // ============================================
  // RENDER: COMMUNITY HEALTH CARD
  // ============================================
  function renderHealthCard(c) {
    var barClass = c.healthScore >= 90 ? 'green' : c.healthScore >= 80 ? 'yellow' : 'red';
    var issueText = c.activeIssues === 0 ? 'No open issues' : c.activeIssues + ' open issue' + (c.activeIssues > 1 ? 's' : '');
    return '<div class="health-card" data-community="' + c.id + '">' +
      '<div class="health-card-name">' + c.name + '</div>' +
      '<div class="health-score">' +
        '<span class="health-grade" style="color:' + (barClass === 'green' ? 'var(--teal)' : barClass === 'yellow' ? 'var(--warning)' : 'var(--danger)') + ';">' + c.healthGrade + '</span>' +
        '<span class="health-number">' + c.healthScore + '/100</span>' +
      '</div>' +
      '<div class="health-bar"><div class="health-bar-fill ' + barClass + '" data-target="' + c.healthScore + '" style="width:0%;"></div></div>' +
      '<div class="health-status">' + issueText + '</div>' +
    '</div>';
  }

  // ============================================
  // RENDER: EVENT ITEM
  // ============================================
  function renderEventItem(evt) {
    var d = evt.date;
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var typeColors = {
      'board': 'rgba(27,42,74,0.08)',
      'inspection': 'rgba(212,148,58,0.1)',
      'community': 'rgba(46,125,111,0.1)',
      'deadline': 'rgba(192,57,43,0.1)',
      'reservation': 'rgba(200,162,84,0.12)',
      'hearing': 'rgba(192,57,43,0.1)',
      'maintenance': 'rgba(27,42,74,0.08)'
    };
    var typeTextColors = {
      'board': 'var(--navy)',
      'inspection': 'var(--warning)',
      'community': 'var(--teal)',
      'deadline': 'var(--danger)',
      'reservation': 'var(--gold-dark)',
      'hearing': 'var(--danger)',
      'maintenance': 'var(--navy)'
    };

    return '<div class="activity-item" style="padding:0.625rem 0;">' +
      '<div class="date-block" style="background:' + (typeColors[evt.type] || typeColors.board) + ';color:' + (typeTextColors[evt.type] || typeTextColors.board) + ';">' +
        '<div class="date-month">' + months[d.getMonth()] + '</div>' +
        '<div class="date-day">' + d.getDate() + '</div>' +
      '</div>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-size:0.875rem;font-weight:600;color:var(--text-dark);">' + evt.title + '</div>' +
        '<div style="font-size:0.75rem;color:var(--text-muted);">' + evt.community + (evt.time ? ' &middot; ' + evt.time : '') + '</div>' +
      '</div>' +
    '</div>';
  }

  // ============================================
  // RENDER: PAYMENT HISTORY ROW
  // ============================================
  function renderPaymentRow(p) {
    return '<tr>' +
      '<td>' + LPMS.formatDate(p.date) + '</td>' +
      '<td>' + p.description + '</td>' +
      '<td style="font-weight:600;">$' + p.amount.toFixed(2) + '</td>' +
      '<td>' + p.method + '</td>' +
      '<td><span class="badge badge-success">Paid</span></td>' +
    '</tr>';
  }

  // ============================================
  // RENDER: MAINTENANCE REQUEST CARD
  // ============================================
  function renderMaintenanceCard(req) {
    return '<div class="card" style="margin-bottom:1rem;cursor:pointer;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">' +
        '<span style="font-size:0.8125rem;font-weight:600;color:var(--text-muted);">' + req.id + '</span>' +
        '<span class="badge badge-warning">' + statusLabel(req.status) + '</span>' +
      '</div>' +
      '<div style="font-size:1rem;font-weight:600;color:var(--text-dark);margin-bottom:0.25rem;">' + (req.subject || req.title || 'Maintenance Request') + '</div>' +
      '<div style="font-size:0.8125rem;color:var(--text-muted);margin-bottom:0.5rem;">' + (req.category || 'General') + ' &middot; ' + LPMS.formatDate(req.submittedDate) + '</div>' +
      (req.description ? '<div style="font-size:0.875rem;color:var(--text-body);line-height:1.5;">' + req.description + '</div>' : '') +
    '</div>';
  }

  // ============================================
  // CONFIRMATION NUMBER GENERATOR
  // ============================================
  function generateConfirmationNumber() {
    var year = new Date().getFullYear();
    var num = 100000 + Math.floor(Math.random() * 899999);
    return 'LP-' + year + '-' + num;
  }

  // ============================================
  // PROCESSING OVERLAY
  // ============================================
  function showProcessingOverlay(message, duration, callback) {
    message = message || 'Processing...';
    duration = duration || 1500;

    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;font-family:"Inter",sans-serif;';
    overlay.innerHTML = '<div style="background:#fff;border-radius:16px;padding:40px 48px;text-align:center;box-shadow:0 24px 64px rgba(0,0,0,0.2);">' +
      '<div style="width:48px;height:48px;border:4px solid var(--border,#E2DFD8);border-top-color:var(--gold,#C8A254);border-radius:50%;animation:demoSpin 0.8s linear infinite;margin:0 auto 16px;"></div>' +
      '<div style="font-size:16px;font-weight:600;color:#1B2A4A;">' + message + '</div>' +
    '</div>';

    if (!document.getElementById('demoSpinStyle')) {
      var style = document.createElement('style');
      style.id = 'demoSpinStyle';
      style.textContent = '@keyframes demoSpin { to { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }

    document.body.appendChild(overlay);

    setTimeout(function() {
      overlay.remove();
      if (callback) callback();
    }, duration);
  }

  // ============================================
  // UTILITY: GET INITIALS
  // ============================================
  function getInitials(name) {
    if (!name) return '??';
    var parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
    }
    return name.substring(0, 2).toUpperCase();
  }

  // ============================================
  // UTILITY: COMMUNITY OPTIONS
  // ============================================
  function renderCommunityOptions(includeAll) {
    var html = '';
    if (includeAll) {
      html += '<option value="all">All Communities</option>';
    }
    for (var i = 0; i < LPMS.communities.length; i++) {
      var c = LPMS.communities[i];
      html += '<option value="' + c.id + '">' + c.name + '</option>';
    }
    return html;
  }

  // ============================================
  // DEMO RESET HANDLER
  // ============================================
  function initDemoReset() {
    var clickCount = 0;
    var clickTimer = null;
    var logo = document.querySelector('.sidebar-logo');
    if (logo) {
      logo.addEventListener('click', function() {
        clickCount++;
        if (clickCount >= 3) {
          clickCount = 0;
          clearTimeout(clickTimer);
          if (confirm('Reset demo data? This will clear all created work orders, payments, and requests.')) {
            LPMS.resetDemo();
            location.reload();
          }
        } else {
          clearTimeout(clickTimer);
          clickTimer = setTimeout(function() { clickCount = 0; }, 800);
        }
      });
    }
  }

  // Auto-init reset handler on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDemoReset);
  } else {
    initDemoReset();
  }

  // ============================================
  // EXPOSE PUBLIC API
  // ============================================
  window.DemoEngine = {
    animateCounter: animateCounter,
    statusBadgeClass: statusBadgeClass,
    statusLabel: statusLabel,
    priorityBadgeClass: priorityBadgeClass,
    priorityLabel: priorityLabel,
    timeAgo: timeAgo,
    getInitials: getInitials,
    renderWorkOrderCard: renderWorkOrderCard,
    renderWorkOrderRow: renderWorkOrderRow,
    renderResidentRow: renderResidentRow,
    renderActivityItem: renderActivityItem,
    renderHealthCard: renderHealthCard,
    renderEventItem: renderEventItem,
    renderPaymentRow: renderPaymentRow,
    renderMaintenanceCard: renderMaintenanceCard,
    generateConfirmationNumber: generateConfirmationNumber,
    showProcessingOverlay: showProcessingOverlay,
    renderCommunityOptions: renderCommunityOptions
  };

})();
