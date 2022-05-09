---
layout: default
---

<link rel="stylesheet" href="/assets/css/bootstrap_styles.css">
<script src="/assets/js/libs/jquery.js"></script>
<script src="/assets/js/libs/bootstrap.js"></script>
<script src="/assets/js/libs/d3v6.min.js"></script>

<div class="container" style="height:100%; width:100%">

  <ul class="nav nav-tabs nav-justified">
    <li><a data-toggle="tab" href="#browse">Browse</a></li>
    <li><a data-toggle="tab" href="#discover">Discover</a></li>
    <li><a data-toggle="tab" href="#compare">Compare Robots</a></li>
    <!-- <li><a data-toggle="tab" href="#compare">Compare Features</a></li> -->
  </ul>

  <div class="tab-content" style="height:100%; width:100%">
    
  <!-- INITIAL SPLASH SCREEN CONTENT -->
  <div id="initial" class="tab-pane fade in active" style="text-align:center;">
  <br>
    Explore the MUFaSAA Dataset by selecting the different tabs above. <br><br>
    The <i>Browse</i> interaction allows you to view all of the robots in this 
    database<br>
    The <i>Discover</i> interaction allows you to find differences between robots that
    are visually similar.<br>
    The <i>Compare</i> interaction allows you to contrast two embodiments in detail.
  </div>

  <!-- BROWSE TAB CONTENT -->
  <div id="browse" class="tab-pane fade" style="padding-left:10%;padding-right:10%">
    <ul id="robot-list" style="display:flex;width:100%;flex-wrap:wrap;padding-left:50px;padding-right:50px;text-align:center;list-style:none;"></ul>
    <script src="/assets/js/viz/browse.js"></script>
  </div>

  <!-- DISCOVER TAB CONTENT -->
  <div id="discover" class="tab-pane fade" style="padding-left:10%;padding-right:10%;">
  <div style="display:flex;flex-direction:column;flex-grow:1;text-align:center;">
    <div style="display:grid;grid-template-columns: 1fr 9fr; grid-gap:10px; align-content: space-evenly; padding-top:1%;">
      <div>
        <div style="display:flex;flex-direction:column;justify-content:space-around;height:100%;flex-wrap:wrap;padding-left:10px;padding-right:10px;text-align:center;list-style:none;">
        <ul class="gui-options">
          <li>
              <input type="radio" id="WARMTH" name="construct" checked="checked"/>
              <label for="WARMTH">Warmth</label>
          </li>
          <li>
              <input type="radio" id="COMPETENCE" name="construct" />
              <label for="COMPETENCE">Competence</label>
          </li>
          <li>
              <input type="radio" id="DISCOMFORT" name="construct" />
              <label for="DISCOMFORT">Discomfort</label>
          </li>
          <li>
              <input type="radio" id="MASCULINE" name="construct" />
              <label for="MASCULINE">Masculinity</label>
          </li>
          <li>
              <input type="radio" id="FEMININE" name="construct" />
              <label for="FEMININE">Femininity</label>
          </li>
          <li>
              <input type="radio" id="ROLE" name="construct" />
              <label for="ROLE">Social Role</label>
          </li>
          <li>
              <input type="radio" id="IDENTIFY" name="construct" />
              <label for="IDENTIFY">Identity Closeness</label>
          </li>
          <li>
              <input type="radio" id="LIKEABILITY" name="construct" />
              <label for="LIKEABILITY">Likeability</label>
          </li>
          <li>
              <input type="radio" id="PERCEPTION" name="construct" />
              <label for="PERCEPTION">Shared Perception and Interpretation</label>
          </li>
          <li>
              <input type="radio" id="TACTILE_MOBILITY" name="construct" />
              <label for="TACTILE_MOBILITY">Tactile Interaction and Mobility</label>
          </li>
          <li>
              <input type="radio" id="NONVERBAL" name="construct" />
              <label for="NONVERBAL">Non-verbal Expressiveness</label>
          </li>
          <li>
              <input type="radio" id="AMBIGUITY" name="construct" />
              <label for="AMBIGUITY">Design Ambiguity</label>
          </li>
          <li>
              <input type="radio" id="ATYPICALITY" name="construct" />
              <label for="ATYPICALITY">Design Atypicality</label>
          </li>
          </ul>
        </div>
      </div>
      <div id='discover-viz-container'>
        <svg id="discover-viz" style="width:100%;min-height:650px;outline:1px solid #aaaaaa;display:block;margin:auto;"></svg>
        <svg id="discover-viz-legend" style="width:100%;height:6%;display:block;margin:auto;"></svg>
      </div>
    </div>
    <script src="/assets/js/tsne.js"></script>
    <script src="/assets/js/viz/discover.js"></script>
    </div>
  </div>

  <!-- COMPARE TAB CONTENT -->
  <div id="compare" class="tab-pane fade" style="padding-left:10%;padding-right:10%">
    <div style="display:grid;grid-template-columns: 4fr 3fr 4fr; grid-gap:10px; align-content: space-evenly; padding-top:1%;">
  
  <div style="text-align:center;">
  
  <select name="left-robot" id="left-robot" style="width:50%;"></select>

  <div style="display:flex;flex-direction:column;justify-content:space-around;height:100%;flex-wrap:wrap;padding-left:10px;padding-right:10px;text-align:center;list-style:none;">
  <img id="left-robot-image" style="object-fit:contain;">
  <img id="left-robot-wordcloud" style="object-fit:contain;">
  <ul id="left-robot-metaphors" style="padding-left:0;"></ul>
  </div>

  </div>

  <div style="text-align:center;">
  <svg id="compare-viz" style="width:100%;min-height:650px;outline:1px solid #aaaaaa;display:block;margin:auto;"></svg>
  </div>

  <div style="text-align:center;">
  <select name="right-robot" id="right-robot" style="width:50%;"></select>

  <div style="display:flex;flex-direction:column;justify-content:space-around;height:100%;flex-wrap:wrap;padding-left:10px;padding-right:10px;text-align:center;list-style:none;">
  <img id="right-robot-image" style="object-fit:contain;">
  
  <img id="right-robot-wordcloud" style="object-fit:contain;">
  <ul id="right-robot-metaphors" style="padding-left:0; "></ul>
  </div>
  
  </div>

  </div>
  <script src="/assets/js/viz/compare.js"></script>

  </div>
</div>
