import docx
import os


images_count = 0
mds_count = 0

md_serial_number_separator = '-'
path_separator = '/'


def create_md_file(md_name, mds_dir, imgs_dir):
    global mds_count

    md_name = str(mds_count) + md_serial_number_separator + md_name
    mds_count += 1

    md_path = mds_dir + '/' + md_name + '.md'

    md_imgs_dir = imgs_dir + '/' + md_name
    os.makedirs(md_imgs_dir, exist_ok=False)

    return md_path, md_imgs_dir


def is_run_a_file_separator(run):
    return run.italic and run.bold and run.underline


def get_img(docx_doc, run, md_imgs_dir, imgs_src_base, md_name):
    global images_count

    img_data = run._element.xpath(
        './descendant::wp:inline/a:graphic/a:graphicData/pic:pic/pic:blipFill/a:blip/@r:embed'
    )[0]

    images_count += 1
    filename = f'image{images_count}.png'
    src = f'../imgs/{md_name}/{filename}'

    with open(md_imgs_dir + '/' + filename, 'wb') as img:
        img.write(docx_doc.part.related_parts[img_data].blob)

    return f'![Image {images_count}]({src})'


def add_tag(tag_content, start, end):
    start = start + "<" + tag_content + ">"
    end = "</" + tag_content + ">" + end

    return start, end


def get_md_formated_run(run):
    start = ""
    end = ""

    if run.italic:
        start, end = add_tag("i", start, end)

    if run.bold:
        start, end = add_tag("b", start, end)

    if run.underline:
        start, end = add_tag("ins", start, end)

    return start + run.text + end


def convert_docx_to_md(docx_path, mds_dir, imgs_dir, imgs_src_base):
    docx_doc = docx.Document(docx_path)

    md_name = "start"
    md_path, md_imgs_dir = create_md_file(md_name, mds_dir, imgs_dir)

    for line in docx_doc.paragraphs:
        md_line = ""

        for run in line.runs:
            if is_run_a_file_separator(run):
                md_name = run.text.replace(' ', '_')
                md_path, md_imgs_dir = create_md_file(md_name, mds_dir, imgs_dir)
                break
            
            if 'inline' in run._element.xml:
                md_line += get_img(docx_doc, run, md_imgs_dir, imgs_src_base, md_name)
            
            md_line += get_md_formated_run(run)
        else:
            with open(md_path, 'a', encoding='utf-8') as md_doc:
                md_doc.write(md_line + '\n\n')


def convert(root_result_dir: str, imgs_src_base: str, docx_path: str):
    global images_count
    global mds_count

    mds_count = 0
    images_count = 0

    docx_path = docx_path.strip('"' + "'")
    docx_name = docx_path.split(path_separator)[-1].split('.')[0]
    docx_name = docx_name.replace(' ', '_')
    
    result_dir = root_result_dir + '/' + docx_name
    os.makedirs(result_dir, exist_ok=False)

    mds_dir = result_dir + '/mds'
    os.makedirs(mds_dir, exist_ok=False)

    imgs_dir = result_dir + '/imgs'
    os.makedirs(imgs_dir, exist_ok=False)

    convert_docx_to_md(docx_path, mds_dir, imgs_dir, imgs_src_base + '/' + docx_name)

    return docx_name, mds_count