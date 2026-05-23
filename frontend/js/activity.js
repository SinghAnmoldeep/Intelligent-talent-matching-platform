// =============================================
// activity.js - Recent Activity tracker
// =============================================
//
// Stores user activity events in localStorage so the dashboard
// "Recent Activity" section reflects what the user actually did, not
// hard-coded placeholder text.
//
// Public functions:
//   addActivity(type, title, meta)  - record one event
//   renderActivity(containerId)     - render the list into a DOM node
//
// Storage shape:
//   localStorage["activity"] = JSON.stringify([
//     { type, title, meta, ts }, ...
//   ])
// Newest first. Capped to the last 25 events to keep storage small.
// =============================================

(function () {
  const KEY = 'activity';
  const MAX_ITEMS = 25;

  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function write(items) {
    try {
      localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
    } catch (e) {
      /* quota exceeded - silent */
    }
  }

  // Public: add an event. type controls the icon color.
  // Recognised types: applied, posted, profile, upgrade, downgrade, viewed
  window.addActivity = function (type, title, meta) {
    const items = read();
    items.unshift({
      type: type || 'viewed',
      title: title || '',
      meta: meta || '',
      ts: Date.now()
    });
    write(items);
  };

  // Relative time formatter (no external deps)
  function relTime(ts) {
    const diff = Math.max(0, Date.now() - ts);
    const sec = Math.floor(diff / 1000);
    if (sec < 60)        return 'just now';
    const min = Math.floor(sec / 60);
    if (min < 60)        return min + ' minute' + (min === 1 ? '' : 's') + ' ago';
    const hr = Math.floor(min / 60);
    if (hr < 24)         return hr + ' hour' + (hr === 1 ? '' : 's') + ' ago';
    const day = Math.floor(hr / 24);
    if (day < 7)         return day + ' day' + (day === 1 ? '' : 's') + ' ago';
    return new Date(ts).toLocaleDateString();
  }

  // Map each activity type to an SVG icon and a colour class
  function iconFor(type) {
    const ICONS = {
      applied: {
        cls: 'activity-icon--blue',
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none">' +
             '<rect x="2" y="7" width="20" height="14" rx="2" stroke="#5046e5" stroke-width="2"/>' +
             '<path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#5046e5" stroke-width="2" stroke-linecap="round"/></svg>'
      },
      posted: {
        cls: 'activity-icon--blue',
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none">' +
             '<path d="M12 5v14M5 12h14" stroke="#5046e5" stroke-width="2" stroke-linecap="round"/></svg>'
      },
      profile: {
        cls: 'activity-icon--purple',
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none">' +
             '<circle cx="12" cy="8" r="4" stroke="#7c3aed" stroke-width="2"/>' +
             '<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#7c3aed" stroke-width="2" stroke-linecap="round"/></svg>'
      },
      upgrade: {
        cls: 'activity-icon--yellow',
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none">' +
             '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="#d97706" stroke-width="2" stroke-linejoin="round"/></svg>'
      },
      downgrade: {
        cls: 'activity-icon--yellow',
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none">' +
             '<path d="M12 5v14M5 12l7 7 7-7" stroke="#d97706" stroke-width="2" stroke-linecap="round"/></svg>'
      },
      viewed: {
        cls: 'activity-icon--purple',
        svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none">' +
             '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#7c3aed" stroke-width="2"/>' +
             '<circle cx="12" cy="12" r="3" stroke="#7c3aed" stroke-width="2"/></svg>'
      }
    };
    return ICONS[type] || ICONS.viewed;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Public: render the activity list into the given container.
  // If no events, shows a friendly empty state.
  window.renderActivity = function (containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const items = read();
    if (items.length === 0) {
      el.innerHTML =
        '<div class="activity-item" style="opacity:0.7">' +
          '<div class="activity-icon activity-icon--purple">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none">' +
              '<circle cx="12" cy="12" r="10" stroke="#7c3aed" stroke-width="2"/>' +
              '<polyline points="12 6 12 12 16 14" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>' +
          '</div>' +
          '<div>' +
            '<p class="activity-title">No recent activity yet</p>' +
            '<p class="activity-meta">Your actions will appear here as you use the platform.</p>' +
          '</div>' +
        '</div>';
      return;
    }

    el.innerHTML = items.map(function (item) {
      const icon = iconFor(item.type);
      const metaParts = [];
      if (item.meta) metaParts.push(esc(item.meta));
      metaParts.push(relTime(item.ts));
      return '' +
        '<div class="activity-item">' +
          '<div class="activity-icon ' + icon.cls + '">' + icon.svg + '</div>' +
          '<div>' +
            '<p class="activity-title">' + esc(item.title) + '</p>' +
            '<p class="activity-meta">' + metaParts.join(' &middot; ') + '</p>' +
          '</div>' +
        '</div>';
    }).join('');
  };
})();
