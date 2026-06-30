document.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await loadData();

    // Emergency phone
    const emPhone = document.getElementById('emergency-phone');
    if (emPhone) emPhone.textContent = data.emergencyPhone;

    // Render news
    const newsContainer = document.getElementById('news-cards');
    const urgentContainer = document.getElementById('urgent-news');
    if (newsContainer) {
      newsContainer.innerHTML = '';
      const latest = data.news.slice(0, 3);
      for (const item of latest) {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
          <div class="news-card__date">${formatDate(item.date)}</div>
          <h3 class="news-card__title">${item.title}</h3>
          <p class="news-card__text">${item.short}</p>
          <button class="news-card__link">Подробнее →</button>
        `;
        card.querySelector('.news-card__link').addEventListener('click', () => showNewsDetail(item));
        newsContainer.appendChild(card);
      }
    }
    if (urgentContainer) {
      urgentContainer.innerHTML = '';
      const urgent = data.news.filter(n => n.urgent);
      if (urgent.length === 0) {
        urgentContainer.innerHTML = '<p style="color:var(--color-text-muted);font-size:0.85rem;">Нет срочных объявлений</p>';
      } else {
        for (const item of urgent) {
          const el = document.createElement('div');
          el.className = 'news__urgent-item';
          el.innerHTML = `
            <div class="news__urgent-item-date">${formatDate(item.date)}</div>
            <div class="news__urgent-item-title">${item.title}</div>
          `;
          el.querySelector('.news__urgent-item-title').addEventListener('click', () => showNewsDetail(item));
          urgentContainer.appendChild(el);
        }
      }
    }

    // Render districts
    const districtsGrid = document.getElementById('districts-grid');
    if (districtsGrid) {
      districtsGrid.innerHTML = '';
      for (const dist of data.districts) {
        const card = document.createElement('div');
        card.className = 'district-card';
        card.innerHTML = `
          <h3 class="district-card__name">${dist.name}</h3>
          <div class="district-card__info">
            <strong>Адрес:</strong> ${dist.address}<br>
            <strong>Телефон:</strong> ${dist.phone}<br>
            <strong>Улицы:</strong> ${dist.streets.join(', ')}
          </div>
          <button class="district-card__homes-toggle" aria-expanded="false">
            Список домов (${dist.homes.length})
          </button>
          <div class="district-card__homes">
            ${dist.homes.join('<br>')}
          </div>
          <button class="btn btn--outline district-card__btn">Подробнее</button>
        `;
        card.querySelector('.district-card__homes-toggle').addEventListener('click', (e) => {
          const homesDiv = card.querySelector('.district-card__homes');
          const btn = e.currentTarget;
          homesDiv.classList.toggle('open');
          btn.setAttribute('aria-expanded', homesDiv.classList.contains('open'));
        });
        card.querySelector('.district-card__btn').addEventListener('click', () => showDistrictDetail(dist));
        districtsGrid.appendChild(card);
      }
    }

    // Render outages
    const outagesBody = document.getElementById('outages-body');
    if (outagesBody) {
      outagesBody.innerHTML = '';
      if (!data.outages || data.outages.length === 0) {
        outagesBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--color-text-muted);">Нет плановых отключений</td></tr>';
      } else {
        for (const o of data.outages) {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${o.district}</td>
            <td>${formatDate(o.date)}</td>
            <td>${o.time}</td>
            <td>${renderOutageType(o.type)}</td>
            <td>${o.addresses}</td>
          `;
          outagesBody.appendChild(tr);
        }
      }
    }

    // Render contacts
    const contactsInfo = document.getElementById('contacts-info');
    if (contactsInfo) {
      contactsInfo.innerHTML = `
        <div class="contacts__card">
          <div class="contacts__icon"><i class="fas fa-map-marker-alt"></i></div>
          <div class="contacts__info"><h4>Адрес</h4><p>${data.contacts.address}</p></div>
        </div>
        <div class="contacts__card">
          <div class="contacts__icon"><i class="fas fa-phone"></i></div>
          <div class="contacts__info"><h4>Телефон</h4><p>${data.contacts.phone}</p></div>
        </div>
        <div class="contacts__card">
          <div class="contacts__icon"><i class="fas fa-envelope"></i></div>
          <div class="contacts__info"><h4>Электронная почта</h4><p><a href="mailto:${data.contacts.email}">${data.contacts.email}</a></p></div>
        </div>
        <div class="contacts__card">
          <div class="contacts__icon"><i class="fas fa-clock"></i></div>
          <div class="contacts__info"><h4>График работы</h4><p>${data.contacts.schedule}</p></div>
        </div>
        <div class="contacts__requisites">
          <h4>Реквизиты</h4>
          <pre>${data.contacts.requisites}</pre>
        </div>
      `;
    }

    // Hero search
    const heroSearchInput = document.getElementById('hero-search');
    const heroSearchBtn = document.getElementById('hero-search-btn');
    const heroResults = document.getElementById('hero-search-results');
    if (heroSearchInput && heroSearchBtn && heroResults) {
      function doHeroSearch() {
        renderSearchResults(searchAddress(heroSearchInput.value), heroResults);
      }
      heroSearchBtn.addEventListener('click', doHeroSearch);
      heroSearchInput.addEventListener('input', doHeroSearch);
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.hero__search') && !e.target.closest('#hero-search-results')) {
          heroResults.classList.remove('active');
        }
      });
    }

    // Search overlay
    const searchToggle = document.getElementById('search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const searchOverlayInput = document.getElementById('search-overlay-input');
    const searchOverlayResults = document.getElementById('search-overlay-results');
    if (searchToggle && searchOverlay) {
      searchToggle.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        if (searchOverlayInput) { searchOverlayInput.value = ''; searchOverlayInput.focus(); }
        if (searchOverlayResults) searchOverlayResults.innerHTML = '';
      });
      searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) searchOverlay.classList.remove('active');
      });
      document.addEventListener('keydown', function handler(e) {
        if (e.key === 'Escape') { searchOverlay.classList.remove('active'); document.removeEventListener('keydown', handler); }
      });
      if (searchOverlayInput && searchOverlayResults) {
        searchOverlayInput.addEventListener('input', () => {
          const results = searchAddress(searchOverlayInput.value);
          searchOverlayResults.innerHTML = '';
          if (results.length === 0) {
            searchOverlayResults.innerHTML = '<div style="padding:16px;color:var(--color-text-muted);">Дом не обслуживается нашей службой.</div>';
            return;
          }
          for (const r of results.slice(0, 10)) {
            const el = document.createElement('div');
            el.className = 'hero__search-result-item';
            el.innerHTML = `
              <div class="result-address">${r.home}</div>
              <div class="result-district">${r.district.name}</div>
              <div class="result-phone">${r.district.phone}</div>
            `;
            el.addEventListener('click', () => {
              showDistrictDetail(r.district);
              searchOverlay.classList.remove('active');
            });
            searchOverlayResults.appendChild(el);
          }
        });
      }
    }

    // Action cards
    const actionMeters = document.getElementById('action-meters');
    const actionRepair = document.getElementById('action-repair');
    const actionOutages = document.getElementById('action-outages');
    if (actionMeters) actionMeters.addEventListener('click', showMeterForm);
    if (actionRepair) actionRepair.addEventListener('click', showRepairForm);
    if (actionOutages) {
      actionOutages.addEventListener('click', () => {
        document.getElementById('outages')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Remove loading placeholders
    document.querySelectorAll('.loading-placeholder').forEach(el => el.remove());

  } catch (err) {
    console.error('Failed to load data:', err);
    document.querySelectorAll('.loading-placeholder').forEach(el => {
      el.className = 'error-placeholder';
      el.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Данные временно недоступны. Пожалуйста, попробуйте позже.';
    });
  }
});
