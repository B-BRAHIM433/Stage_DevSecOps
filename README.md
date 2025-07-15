# 🛡️ Security Event Tracker

## 📌 Description

**Security Event Tracker** est un projet combinant **DevOps** et **SOC (Security Operations Center)**.  
Il permet de :
- Détecter automatiquement des vulnérabilités dans le code ou l'infrastructure (Docker)
- Générer des **alertes** en cas de risques critiques
- Visualiser les événements de sécurité dans un **dashboard web**
- Automatiser le tout dans un pipeline **CI/CD (GitHub Actions)**

> Ce projet est entrein de réaliser dans le cadre d’un stage de 6 semaines chez Tasmim Web. Il combine entre **développement**, **sécurité offensive** et **outils DevOps**.

---

## 🎯 Objectifs du projet

- ✅ Mettre en place une chaîne CI/CD de sécurité
- ✅ Analyser automatiquement les vulnérabilités du code
- ✅ Automatiser la génération d’alertes sécurité
- ✅ Créer une interface web simple pour consulter les incidents
- ✅ Simuler une partie du travail d’un analyste SOC niveau 1

---

## 🛠️ Stack utilisée

| Domaine             | Outil utilisé                                  |
|----------------     |------------------------------------------------|
| CI/CD               | GitHub Actions                                 |
| Sécurité code       | [Bandit](https://github.com/PyCQA/bandit)      |
| Sécurité conteneur  | [Trivy](https://github.com/aquasecurity/trivy) |
| Web app (dashboard) | Flask + HTML/CSS                               |
| Alertes             | Slack Webhook / Email (SMTP)                   |
| Base de logs        | JSON ou SQLite                                 |
| OS                  | Ubuntu (VM locale)                             |

---

## 📦 Architecture du projet

security-event-tracker/
├── app/
│ └── main.py # Application simulée
├── scanner/
│ ├── scan_logs.py # Scanner personnalisé
│ └── alerts.py # Générateur d'alertes
├── reports/
│ └── report.json # Résultats des scans
├── dashboard/
│ ├── app.py # Flask App
│ └── templates/
│ └── index.html # UI du dashboard
├── .github/
│ └── workflows/
│ └── ci.yml # Pipeline GitHub Actions
├── Dockerfile # (optionnel)
└── README.md


---

## ⚙️ Fonctionnement

### 1. 📥 Scan de vulnérabilités

L’outil **Bandit** est utilisé pour détecter les vulnérabilités dans le code Python :

```bash
bandit -r app/ -f json -o reports/report.json
