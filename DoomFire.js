/*
 * Copyright 2021 Google Inc. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

const HTML_COLOR_SCALE = [
  '#070707', '#1f0707', '#2f0f07',
  '#470f07', '#571707', '#671f07',
  '#771f07', '#8f2707', '#9f2f07',
  '#af3f07', '#bf4707', '#c74707',
  '#DF4F07', '#DF5707', '#DF5707',
  '#D75F07', '#D7670F', '#cf6f0f',
  '#cf770f', '#cf7f0f', '#CF8717',
  '#C78717', '#C78F17', '#C7971F',
  '#BF9F1F', '#BF9F1F', '#BFA727',
  '#BFA727', '#BFAF2F', '#B7AF2F',
  '#B7B72F', '#B7B737', '#CFCF6F',
  '#DFDF9F', '#EFEFC7', '#FFFFFF',   
];


const PROPERTY_PIXEL_SIZE = '--doomfire-pixel-size';

class DoomFire {
  static get inputProperties() {
    return [
      PROPERTY_PIXEL_SIZE,
    ];
  }
  
  paint(ctx, geom, properties) {
    const size = Math.max(parseInt(properties.get(PROPERTY_PIXEL_SIZE)), 1);
    const num_rows = Math.trunc(geom.height / size);
    const num_cols = Math.trunc(geom.width / size);
    const num_pixels = num_rows * num_cols;
    let flames = [];

    for (let i = 0; i < num_pixels; i++) {
      flames[i] = 0;
    }

    const bottom_row = (num_rows - 1) * num_cols;
    for (let x = 0; x < num_cols; x++) {
      flames[bottom_row + x] = HTML_COLOR_SCALE.length - 1;
    }

    for (let y = num_rows - 2; y > 0; y--) {
      const row_start = y * num_cols;
      const previous_row_start = (y + 1) * num_cols;
      for (let x = 0; x < num_cols; x++) {
        const rand = Math.trunc(Math.random() * 3);
        const src_x = Math.min(Math.max(x + rand - 1, 0), num_cols - 1);
        const src_color = flames[previous_row_start + src_x];
        const dst_color = Math.max(src_color - (rand & 1), 0);
        flames[row_start + x] = dst_color;
      }
    }

    for (let y = 0; y < num_rows; y++) {
      for (let x = 0; x < num_cols; x++) {
        let color_id = flames[y * num_cols + x];
        ctx.fillStyle = HTML_COLOR_SCALE[color_id];
        ctx.fillRect(x * size, y * size, size + 1, size + 1);
      }
    }
  }
}
registerPaint('doomfire', DoomFire);
