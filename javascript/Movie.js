import { IMG } from './api.js';

export class Movie {

    constructor(data) {

        this._titulo = data.title;
        this._año = data.release_date ? data.release_date.split('-')[0] : "Desconocido";
        this._rating = data.vote_average ? data.vote_average.toFixed(1) : "Pendiente";
        this._poster = data.poster_path ? `${IMG}${data.poster_path}` : 'img/placeholder.jpg';
        this._estudio = data.production_companies?.[0]?.name || "Studio";

        // BADGE
        const añoActual = new Date().getFullYear();

        if (this._año >= añoActual - 1) {
            this._badge = "Novedad";

        } else if (this._rating >= 8.5) {
            this._badge = "Top";

        } else {
            this._badge = "Clásico";
        }
    }

    get titulo() {
        return this._titulo;
    }

    get rating() {
        return this._rating;
    }

    get poster() {
        return this._poster;
    }

    get estudio() {
        return this._estudio;
    }

    get duracion() {
        return this._duracion;
    }

    get año() {
        return this._año;
    }

    get badge() {
        return this._badge;
    }

    toCard() {

        const article = document.createElement('article');

        article.classList.add('card');

        article.innerHTML = `
            <div class="card-visual">
                <img class="card-img" src="${this.poster}"  alt="${this.titulo}" loading="lazy">
                <span class="card-rating">★ ${this.rating}</span>
                <span class="card-badge">${this.badge}</span>
            </div>
            <div class="card-info-content">
                <h3>${this.titulo}</h3>
                <span>${this.estudio} · ${this.año}</span>
            </div>
        `;

        return article;
    }
}