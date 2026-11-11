(function(window, document) {
	'use strict';

	if (typeof window.WeakSet === 'undefined' || typeof window.WeakMap === 'undefined' || typeof window.Set === 'undefined') {
		try {
			if (window.console && typeof window.console.error === 'function') {
				window.console.error('[BrandProductEventTracker]', {
					reason: 'unknown_error',
					stage: 'init',
					sourceEvent: '',
					widgetCode: '',
					prodCode: '',
					error: null
				});
			}
		} catch (_error) {
		}
		return;
	}

	class BrandProductEventTracker {
		static init() {
			if (BrandProductEventTracker.initialized) {
				return;
			}

			BrandProductEventTracker.initialized = true;
			BrandProductEventTracker.ensureObserver();
			BrandProductEventTracker.scan();
			BrandProductEventTracker.flushQueue();
		}

		static scan(widgetCode) {
			try {
				const root = BrandProductEventTracker.getScanRoot(widgetCode);
				if (!root) {
					return;
				}

				const cards = root.querySelectorAll('._shop_item[data-brand-product-event-properties]');
				cards.forEach(function(card) {
					BrandProductEventTracker.observeCard(card);
				});
			} catch (error) {
				BrandProductEventTracker.logFailure('scan_error', 'scan', '', widgetCode || '', '', error);
			}
		}

		static getScanRoot(widgetCode) {
			if (!widgetCode) {
				return document;
			}

			return document.getElementById('container_' + widgetCode);
		}

		static observeCard(card) {
			if (!card || BrandProductEventTracker.observedCards.has(card)) {
				return;
			}

			BrandProductEventTracker.observedCards.add(card);
			card.addEventListener('click', function(event) {
				BrandProductEventTracker.handleClick(card, event);
			}, true);

			const observer = BrandProductEventTracker.ensureObserver();
			if (observer) {
				try {
					observer.observe(card);
				} catch (error) {
					BrandProductEventTracker.logFailure('observer_error', 'view', BrandProductEventTracker.VIEW_EVENT, '', BrandProductEventTracker.getProdCode(card), error);
				}
			}
		}

		static ensureObserver() {
			if (BrandProductEventTracker.observer) {
				return BrandProductEventTracker.observer;
			}

			if (typeof window.IntersectionObserver === 'undefined') {
				BrandProductEventTracker.logFailure('intersection_observer_unavailable', 'view', BrandProductEventTracker.VIEW_EVENT, '', '', null);
				return null;
			}

			try {
				BrandProductEventTracker.observer = new window.IntersectionObserver(function(entries, observer) {
					entries.forEach(function(entry) {
						BrandProductEventTracker.handleIntersection(entry, observer);
					});
				}, {
					threshold: 0.8
				});
			} catch (error) {
				BrandProductEventTracker.logFailure('observer_error', 'view', BrandProductEventTracker.VIEW_EVENT, '', '', error);
				BrandProductEventTracker.observer = null;
			}

			return BrandProductEventTracker.observer;
		}

		static handleIntersection(entry, observer) {
			const card = entry.target;
			try {
				if (BrandProductEventTracker.viewedCards.has(card)) {
					observer.unobserve(card);
					return;
				}

				if (entry.isIntersecting) {
					if (BrandProductEventTracker.intersectionTimers.has(card)) {
						return;
					}

					const timer = window.setTimeout(function() {
						BrandProductEventTracker.intersectionTimers.delete(card);
						BrandProductEventTracker.fireView(card, BrandProductEventTracker.IMPRESSION_SOURCE_VIEWPORT);
						observer.unobserve(card);
					}, BrandProductEventTracker.VIEW_DELAY);

					BrandProductEventTracker.intersectionTimers.set(card, timer);
					return;
				}

				BrandProductEventTracker.clearIntersectionTimer(card);
			} catch (error) {
				BrandProductEventTracker.logFailure('observer_error', 'view', BrandProductEventTracker.VIEW_EVENT, '', BrandProductEventTracker.getProdCode(card), error);
			}
		}

		static handleClick(card, event) {
			try {
				const cardActionElement = BrandProductEventTracker.getCardActionElement(card, event.target);
				if (cardActionElement) {
					BrandProductEventTracker.handleCardActionClick(card, cardActionElement);
					return;
				}

				if (!BrandProductEventTracker.isProductDetailLinkClick(card, event.target)) {
					return;
				}

				if (!BrandProductEventTracker.viewedCards.has(card)) {
					BrandProductEventTracker.fireView(card, BrandProductEventTracker.IMPRESSION_SOURCE_CLICK);
				}

				BrandProductEventTracker.trackCardEvent(card, BrandProductEventTracker.CLICK_EVENT, 'click');
			} catch (error) {
				BrandProductEventTracker.logFailure('unknown_error', 'click', BrandProductEventTracker.CLICK_EVENT, '', BrandProductEventTracker.getProdCode(card), error);
			}
		}

		static handleCardActionClick(card, cardActionElement) {
			const cardAction = cardActionElement.getAttribute(BrandProductEventTracker.CARD_ACTION_ATTRIBUTE);
			const cardActionEvent = BrandProductEventTracker.getCardActionEvent(cardAction);
			if (!cardActionEvent) {
				return;
			}

			if (!BrandProductEventTracker.viewedCards.has(card)) {
				BrandProductEventTracker.fireView(card, BrandProductEventTracker.IMPRESSION_SOURCE_CLICK);
			}

			const options = {
				content: cardActionEvent.content
			};

			if (cardAction === BrandProductEventTracker.CARD_ACTION_WISHLIST) {
				options.extraProperties = {
					wishlist_action: BrandProductEventTracker.getWishlistAction(cardActionElement)
				};
			}

			BrandProductEventTracker.trackCardEvent(card, cardActionEvent.eventName, 'click', options);
		}

		static getCardActionElement(card, target) {
			if (!target || typeof target.closest !== 'function') {
				return null;
			}

			const actionElement = target.closest('[' + BrandProductEventTracker.CARD_ACTION_ATTRIBUTE + ']');
			if (!actionElement || !card.contains(actionElement)) {
				return null;
			}

			return actionElement;
		}

		static getCardActionEvent(cardAction) {
			switch (cardAction) {
				case BrandProductEventTracker.CARD_ACTION_REVIEW:
					return {
						eventName: BrandProductEventTracker.REVIEW_CLICK_EVENT,
						content: 'view_review'
					};
				case BrandProductEventTracker.CARD_ACTION_WISHLIST:
					return {
						eventName: BrandProductEventTracker.WISHLIST_CLICK_EVENT,
						content: 'add_to_wishlist'
					};
				case BrandProductEventTracker.CARD_ACTION_CART:
					return {
						eventName: BrandProductEventTracker.CART_CLICK_EVENT,
						content: 'add_to_cart'
					};
				default:
					return null;
			}
		}

		static getWishlistAction(cardActionElement) {
			return cardActionElement.querySelector('.im-ico-liked') ? 'removed' : 'added';
		}

		static isProductDetailLinkClick(card, target) {
			if (!target || typeof target.closest !== 'function') {
				return false;
			}

			const productLink = target.closest('a');
			if (!productLink || !card.contains(productLink)) {
				return false;
			}

			return (productLink.getAttribute('href') || '').indexOf('idx=') !== -1;
		}

		static fireView(card, impressionSource) {
			if (BrandProductEventTracker.viewedCards.has(card)) {
				return true;
			}

			const tracked = BrandProductEventTracker.trackCardEvent(card, BrandProductEventTracker.VIEW_EVENT, 'view', {
				extraProperties: {
					impression_source: impressionSource || BrandProductEventTracker.IMPRESSION_SOURCE_VIEWPORT
				}
			});
			if (tracked) {
				BrandProductEventTracker.viewedCards.add(card);
			}

			return tracked;
		}

		static trackCardEvent(card, sourceEvent, stage, options) {
			const properties = BrandProductEventTracker.getEventProperties(card, stage, sourceEvent);
			if (!properties) {
				return false;
			}
			const eventProperties = BrandProductEventTracker.getEventPropertiesWithBrandScopeMeta(properties, stage, options);

			if (typeof window.BrandScope === 'undefined' || typeof window.BrandScope.track !== 'function') {
				BrandProductEventTracker.logFailure('brand_scope_unavailable', stage, sourceEvent, eventProperties.widget_code || '', eventProperties.prod_code || '', null);
				return false;
			}

			try {
				window.BrandScope.track(sourceEvent, eventProperties);
				return true;
			} catch (error) {
				BrandProductEventTracker.logFailure('track_error', stage, sourceEvent, eventProperties.widget_code || '', eventProperties.prod_code || '', error);
			}

			return false;
		}

		static getEventPropertiesWithBrandScopeMeta(properties, stage, options) {
			const eventOptions = options || {};
			const eventProperties = Object.assign({}, properties, {
				action: stage,
				content: eventOptions.content || 'product',
				where: 'shopping_widget'
			});

			if (stage === 'view') {
				eventProperties.target = 'component';
			}

			if (eventOptions.extraProperties) {
				Object.assign(eventProperties, eventOptions.extraProperties);
			}

			return eventProperties;
		}

		static getEventProperties(card, stage, sourceEvent) {
			let properties;
			try {
				properties = JSON.parse(card.getAttribute('data-brand-product-event-properties') || '');
			} catch (error) {
				BrandProductEventTracker.logFailure('invalid_properties_json', stage, sourceEvent, '', BrandProductEventTracker.getProdCode(card), error);
				return null;
			}

			if (!properties || typeof properties !== 'object') {
				BrandProductEventTracker.logFailure('missing_required_properties', stage, sourceEvent, '', '', null);
				return null;
			}

			const requiredKeys = [
				'prod_code',
				'widget_code',
				'sort_type',
				'slot_index',
				'page_no',
				'prod_category_code',
				'ranking_source',
				'ranking_fallback_reason'
			];

			for (let i = 0; i < requiredKeys.length; i++) {
				if (!Object.prototype.hasOwnProperty.call(properties, requiredKeys[i])) {
					BrandProductEventTracker.logFailure('missing_required_properties', stage, sourceEvent, properties.widget_code || '', properties.prod_code || '', null);
					return null;
				}
			}

			if (properties.ranking_fallback_reason === null) {
				properties.ranking_fallback_reason = '';
			}

			return properties;
		}

		static clearIntersectionTimer(card) {
			if (!BrandProductEventTracker.intersectionTimers.has(card)) {
				return;
			}

			window.clearTimeout(BrandProductEventTracker.intersectionTimers.get(card));
			BrandProductEventTracker.intersectionTimers.delete(card);
		}

		static flushQueue() {
			const queue = window.__brandProductEventTrackerQueue;
			if (!Array.isArray(queue) || queue.length === 0) {
				window.__brandProductEventTrackerQueue = [];
				return;
			}

			window.__brandProductEventTrackerQueue = [];
			queue.forEach(function(item) {
				if (!item || item.type !== 'scan') {
					return;
				}

				BrandProductEventTracker.scan(item.widgetCode);
			});
		}

		static getProdCode(card) {
			try {
				const properties = JSON.parse(card.getAttribute('data-brand-product-event-properties') || '{}');
				return properties && properties.prod_code ? properties.prod_code : '';
			} catch (error) {
				return '';
			}
		}

		static logFailure(reason, stage, sourceEvent, widgetCode, prodCode, error) {
			try {
				const key = [reason, stage, sourceEvent, widgetCode].join(':');
				if (BrandProductEventTracker.loggedFailures.has(key)) {
					return;
				}

				BrandProductEventTracker.loggedFailures.add(key);
				if (window.console && typeof window.console.error === 'function') {
					window.console.error('[BrandProductEventTracker]', {
						reason: reason,
						stage: stage,
						sourceEvent: sourceEvent,
						widgetCode: widgetCode,
						prodCode: prodCode,
						error: error
					});
				}
			} catch (_error) {
			}
		}
	}

	BrandProductEventTracker.VIEW_EVENT = 'view_component_product_shopping_widget';
	BrandProductEventTracker.CLICK_EVENT = 'click_product_shopping_widget';
	BrandProductEventTracker.CART_CLICK_EVENT = 'click_add_to_cart_shopping_widget';
	BrandProductEventTracker.WISHLIST_CLICK_EVENT = 'click_add_to_wishlist_shopping_widget';
	BrandProductEventTracker.REVIEW_CLICK_EVENT = 'click_view_review_shopping_widget';
	BrandProductEventTracker.CARD_ACTION_ATTRIBUTE = 'data-shopping-widget-card-action';
	BrandProductEventTracker.CARD_ACTION_REVIEW = 'review';
	BrandProductEventTracker.CARD_ACTION_WISHLIST = 'wishlist';
	BrandProductEventTracker.CARD_ACTION_CART = 'cart';
	BrandProductEventTracker.IMPRESSION_SOURCE_VIEWPORT = 'viewport';
	BrandProductEventTracker.IMPRESSION_SOURCE_CLICK = 'click';
	BrandProductEventTracker.VIEW_DELAY = 500;
	BrandProductEventTracker.initialized = false;
	BrandProductEventTracker.observedCards = new WeakSet();
	BrandProductEventTracker.viewedCards = new WeakSet();
	BrandProductEventTracker.intersectionTimers = new WeakMap();
	BrandProductEventTracker.loggedFailures = new Set();
	BrandProductEventTracker.observer = null;

	window.BrandProductEventTracker = BrandProductEventTracker;

	function bootstrapBrandProductEventTracker() {
		try {
			BrandProductEventTracker.init();
		} catch (error) {
			BrandProductEventTracker.logFailure('unknown_error', 'init', '', '', '', error);
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', bootstrapBrandProductEventTracker);
	} else {
		bootstrapBrandProductEventTracker();
	}
})(window, document);
