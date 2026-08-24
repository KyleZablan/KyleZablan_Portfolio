(function () {
	'use strict';

	/* =========================================================
	   Mobile nav toggle
	========================================================= */
	var toggle = document.querySelector('.wf-nav-toggle');
	var tabs = document.getElementById('wf-primary-tabs');

	if (toggle && tabs) {
		toggle.addEventListener('click', function () {
			var isOpen = tabs.classList.toggle('is-open');
			toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
		});

		tabs.querySelectorAll('a').forEach(function (link) {
			link.addEventListener('click', function () {
				tabs.classList.remove('is-open');
				toggle.setAttribute('aria-expanded', 'false');
			});
		});
	}

	/* =========================================================
	   Highlight the active tab while scrolling
	========================================================= */
	var sections = document.querySelectorAll('main [id]');
	var tabLinks = tabs ? tabs.querySelectorAll('a[href^="#"]') : [];

	if (sections.length && tabLinks.length && 'IntersectionObserver' in window) {
		var sectionObserver = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					var id = entry.target.getAttribute('id');
					tabLinks.forEach(function (link) {
						link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
					});
				}
			});
		}, { rootMargin: '-40% 0px -55% 0px' });

		sections.forEach(function (section) { sectionObserver.observe(section); });
	}

	/* =========================================================
	   Fade sections in as they scroll into view
	========================================================= */
	var fadeEls = document.querySelectorAll('.wf-fade-in');
	if (fadeEls.length && 'IntersectionObserver' in window) {
		var fadeObserver = new IntersectionObserver(function (entries, observer) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.15 });

		fadeEls.forEach(function (el) { fadeObserver.observe(el); });
	} else {
		fadeEls.forEach(function (el) { el.classList.add('is-visible'); });
	}

	/* =========================================================
	   Contact form
	   ---------------------------------------------------------
	   This is a static site, so there's no server to send email
	   from directly. Two ways to make the form actually deliver
	   messages to your inbox:

	   OPTION A — Formspree (easiest, no code changes needed here)
	     1. Create a free form at https://formspree.io
	     2. They give you an endpoint like:
	          https://formspree.io/f/xxxxabcd
	     3. Set FORM_ENDPOINT below to that URL.
	     4. Done — messages will POST there and land in your inbox.

	   OPTION B — mailto fallback (works with zero setup)
	     If FORM_ENDPOINT is left empty, submitting the form just
	     opens the visitor's own email app with your address and
	     their message pre-filled, which they then send themselves.
	     No setup required, but it depends on them having an email
	     app configured, and it's a slightly clunkier experience.
	========================================================= */
	var FORM_ENDPOINT = ''; // e.g. 'https://formspree.io/f/xxxxabcd'
	var CONTACT_EMAIL = 'you@example.com'; // used only for the mailto fallback

	var form = document.getElementById('wf-contact-form');
	var msgBox = document.getElementById('wf-form-msg');

	function showMessage(text, type) {
		if (!msgBox) return;
		msgBox.textContent = text;
		msgBox.hidden = false;
		msgBox.className = 'wf-form-msg ' + type;
	}

	if (form) {
		form.addEventListener('submit', function (e) {
			e.preventDefault();

			var name = form.name.value.trim();
			var email = form.email.value.trim();
			var message = form.message.value.trim();

			if (!name || !email || !message) {
				showMessage('Please fill in your name, email, and message.', 'error');
				return;
			}

			if (FORM_ENDPOINT) {
				// Option A: send to Formspree (or any compatible endpoint)
				fetch(FORM_ENDPOINT, {
					method: 'POST',
					headers: { 'Accept': 'application/json' },
					body: new FormData(form)
				}).then(function (response) {
					if (response.ok) {
						showMessage("Thanks — your message is on its way. I'll be in touch soon.", 'success');
						form.reset();
					} else {
						showMessage('Something went wrong sending that. Please try again or email me directly.', 'error');
					}
				}).catch(function () {
					showMessage('Something went wrong sending that. Please try again or email me directly.', 'error');
				});
			} else {
				// Option B: fall back to opening the visitor's email client
				var subject = encodeURIComponent('Message from ' + name + ' (portfolio site)');
				var body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
				window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
				showMessage('Opening your email app to send this — if nothing happens, email me directly instead.', 'success');
			}
		});
	}
})();
