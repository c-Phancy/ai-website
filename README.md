<a id="readme-top"></a>

<div align="center">

<h3 align="center">Pong</h3>

  <p align="center">
    A game website
    <br />
    <a href="https://c-phancy.github.io/ai-website/">View Demo</a>
    &middot;
    <a href="https://github.com/c-Phancy/ai-website/issues/new/choose">Report Bug</a>
  </p>
</div>



## About The Project

This is a sample website built using <a href="https://chatgpt.com/">ChatGPT</a>. The goal was to generate a website with multiple pages using prompts for ChatGPT. The website is intended to be a website that compiles simple games that can be played on the browser against an AI. It is in the early stages, with Pong being the only game available.


### Built With

* HTML
* CSS
* Javascript


#### Purpose

The purpose of the project is to recognize how AI can assist in modern development. It teaches how to explore AI's capabilities and also how to effectively utilize it with specific language to cater to your needs.



## Roadmap

- [x] Add game AI
- [ ] Add responsive design
- [ ] Add other games
- [x] Fix game history tracking bug



## Git Process

This project was published to this GitHub repository using Git in the following steps:
* Initiate the repository
* Configure Git global settings
* Adding files to a commit
* Linking and pushing to the repository



## Challenges
* Adding function to games
  * The AI struggled to provide working code for games, instead generating skeletons or buggy designs
* CSS Design inconsistencies
* Brainstorming page ideas
* Responsive design
* Game history logic



## GitHub Actions

This project is deployed using GitHub Actions by changing the source of deployment from direct from branch. There is a workflow added that triggers redeployment after two ways:
1. Pushing to the main branch
2. Manually triggering in the Actions tab -> Deploy static content to Pages -> Run workflow

### Challenges

As this was a pre-configured workflow file, there were no particular challenges - as there were no changes aside from changing the default branch name. As the project expands, please adjust the configurations (such as excluded files) accordingly.
